import os, re, json
from fastapi import APIRouter, UploadFile, File, Form
import google.generativeai as genai

router = APIRouter()
genai.configure(api_key=os.getenv('GOOGLE_API_KEY') or os.getenv('GEMINI_API_KEY'))
model = genai.GenerativeModel('gemini-2.5-flash')

@router.post('/translate-grievance')
async def translate_grievance(
    text: str = Form(''),
    file: UploadFile = File(None)
):
    print(f"Received request: text='{text}', file={file.filename if file else 'None'}")
    try:
        parts = []

        # If user uploaded an image, add it to the prompt
        if file:
            print(f"Processing image: {file.filename}, type: {file.content_type}")
            image_data = await file.read()
            parts.append({
                'mime_type': file.content_type,
                'data': image_data
            })
            # Reset file cursor just in case
            await file.seek(0)

        prompt = f'''
        You are a legal assistant for Indian Consumer Courts.
        A user has provided this grievance (possibly in a native language):
        {text}

        If an image was attached, read all text from it (OCR).

        Return a JSON object with these exact fields:
        - translated_text: formal English translation of the grievance
        - legal_category: one of [Consumer Fraud, Deficiency in Service,
          Unfair Trade Practice, Product Liability, Medical Negligence]
        - summary: 2 sentence summary of the complaint

        Respond ONLY with valid JSON.
        '''

        parts.append(prompt)
        
        print("Calling Gemini model...")
        response = model.generate_content(parts)
        print("Received response from Gemini")
        
        if not response.text:
            print("Empty response from model")
            return {"error": "Empty response from AI service"}
            
        clean = re.sub(r'```json|```', '', response.text).strip()
        print(f"Parsed JSON: {clean}")
        return json.loads(clean)
        
    except Exception as e:
        print(f"Error in translate_grievance: {str(e)}")
        import traceback
        traceback.print_exc()
        return {"error": str(e)}