import os
import base64
import io
import re
import json

from fastapi import APIRouter, UploadFile, File, Form
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import google.generativeai as genai
from elevenlabs.client import ElevenLabs

router = APIRouter()

# Configure Gemini
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-1.5-flash")

# Configure ElevenLabs
el_client = ElevenLabs(api_key=os.getenv("ELEVENLABS_API_KEY"))

# Rachel voice ID on ElevenLabs (professional female voice, free tier)
RACHEL_VOICE_ID = "21m00Tcm4TlvDq8ikWAM"


@router.post("/translate-grievance")
async def translate_grievance(
    text: str = Form(default=""),
    file: UploadFile = File(default=None),
):
    """
    Accepts a grievance in any language (text and/or image).
    Gemini translates it to formal English, identifies legal category,
    and returns a structured JSON response.
    """
    parts = []

    # If user uploaded an image, include it in the prompt (OCR)
    if file and file.filename:
        image_data = await file.read()
        parts.append(
            {
                "mime_type": file.content_type,
                "data": base64.b64encode(image_data).decode(),
            }
        )

    prompt = f"""You are a legal assistant for Indian Consumer Courts.
A user has provided this grievance (possibly in Hindi, Tamil, Telugu, Bengali, or other Indian language):

"{text}"

{"An image/document has been attached — extract ALL text from it (OCR)." if file and file.filename else ""}

Your task:
1. Translate the grievance to clear, formal English.
2. Identify the legal category from: Consumer Fraud, Deficiency in Service, Unfair Trade Practice, Product Liability, Medical Negligence.
3. Write a 2-sentence summary.

Respond ONLY with a valid JSON object — no markdown, no code fences:
{{
  "translated_text": "formal English translation here",
  "legal_category": "one of the five categories above",
  "summary": "2 sentence summary here"
}}"""

    parts.append(prompt)

    try:
        response = model.generate_content(parts)
        raw = response.text.strip()
        # Strip markdown code fences if present
        raw = re.sub(r"^```json\s*|^```\s*|```$", "", raw, flags=re.MULTILINE).strip()
        return json.loads(raw)
    except json.JSONDecodeError:
        # Fallback: return as-is with a best-effort parse
        return {
            "translated_text": text,
            "legal_category": "Consumer Fraud",
            "summary": "Could not parse AI response. Please try again.",
            "raw_response": response.text,
        }
    except Exception as e:
        return {"error": str(e), "translated_text": text, "legal_category": "Consumer Fraud", "summary": ""}


class SpeakRequest(BaseModel):
    script: str


@router.post("/speak")
async def speak_script(data: SpeakRequest):
    """
    Converts the courtroom script to speech using ElevenLabs.
    Returns an audio/mpeg stream the browser can play directly.
    """
    try:
        audio_generator = el_client.text_to_speech.convert(
            voice_id=RACHEL_VOICE_ID,
            text=data.script,
            model_id="eleven_multilingual_v2",
        )
        audio_bytes = b"".join(audio_generator)
        return StreamingResponse(
            io.BytesIO(audio_bytes),
            media_type="audio/mpeg",
            headers={"Content-Disposition": "inline; filename=courtroom_script.mp3"},
        )
    except Exception as e:
        return {"error": str(e)}
