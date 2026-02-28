import os
import re
import json
import uuid
import tempfile

import httpx
from fastapi import APIRouter
from fastapi.responses import FileResponse
from pydantic import BaseModel
import google.generativeai as genai
from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Paragraph as RLParagraph, Spacer, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors

router = APIRouter()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-1.5-flash")

INDIANKANOON_TOKEN = os.getenv("INDIANKANOON_TOKEN", "")


class CaseData(BaseModel):
    translated_text: str
    legal_category: str
    defendant_name: str
    claim_amount: float
    incident_date: str


class PDFRequest(BaseModel):
    defendant_name: str
    claim_amount: float
    incident_date: str
    legal_category: str
    translated_text: str
    legal_sections: list
    courtroom_script: str
    confidence_score: int
    complexity: str


@router.post("/analyze")
async def analyze_case(case: CaseData):
    """
    Fetches similar Indian Kanoon cases, passes everything to Gemini,
    and returns confidence score, complexity, legal sections, and courtroom script.
    """
    # Step 1: Fetch similar cases from Indian Kanoon
    kanoon_results = []
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            res = await client.get(
                "https://api.indiankanoon.org/search/",
                params={"formInput": f"{case.legal_category} consumer court", "pagenum": 0},
                headers={"Authorization": f"Token {INDIANKANOON_TOKEN}"},
            )
            if res.status_code == 200:
                data = res.json()
                kanoon_results = [
                    doc.get("title", "") for doc in data.get("docs", [])[:5]
                ]
    except Exception:
        kanoon_results = ["Unable to fetch Indian Kanoon data — proceeding with Gemini analysis"]

    # Step 2: Gemini analyzes the case
    prompt = f"""You are an expert legal analyst for Indian Consumer Courts under the Consumer Protection Act 2019.

Case Details:
- Grievance: {case.translated_text}
- Legal Category: {case.legal_category}
- Defendant: {case.defendant_name}
- Claim Amount: ₹{case.claim_amount}
- Date of Incident: {case.incident_date}

Similar precedent cases from Indian Kanoon:
{chr(10).join(f"- {c}" for c in kanoon_results) if kanoon_results else "- No precedents fetched"}

Based on Indian consumer law, analyze this case thoroughly.

Respond ONLY with valid JSON — no markdown, no code fences:
{{
  "confidence_score": <integer 0-100, likelihood of winning>,
  "complexity": "<Simple or Complex>",
  "legal_sections": ["Section X of Consumer Protection Act 2019", "..."],
  "reasoning": "<2-3 sentence explanation of the score>",
  "courtroom_script": "<Professional 150-word statement the claimant can read in court. Start with: Your Honour, I am filing this complaint against...>"
}}"""

    try:
        response = model.generate_content(prompt)
        raw = response.text.strip()
        raw = re.sub(r"^```json\s*|^```\s*|```$", "", raw, flags=re.MULTILINE).strip()
        result = json.loads(raw)
        result["kanoon_cases"] = kanoon_results
        return result
    except json.JSONDecodeError:
        return {
            "confidence_score": 50,
            "complexity": "Simple",
            "legal_sections": ["Section 35, Consumer Protection Act 2019"],
            "reasoning": "Could not fully analyze — default values used. Try re-submitting.",
            "courtroom_script": "Your Honour, I am filing this complaint against the defendant for the grievance described herein.",
            "kanoon_cases": kanoon_results,
            "raw_response": response.text,
        }
    except Exception as e:
        return {"error": str(e)}


@router.post("/generate-pdf")
def generate_pdf(req: PDFRequest):
    """
    Generates a professional consumer complaint PDF using ReportLab.
    Returns the PDF as a file download.
    """
    tmp = tempfile.NamedTemporaryFile(delete=False, suffix=".pdf")
    doc = SimpleDocTemplate(tmp.name, pagesize=A4, rightMargin=60, leftMargin=60, topMargin=60, bottomMargin=40)
    styles = getSampleStyleSheet()

    # Custom styles
    title_style = ParagraphStyle(
        "Title",
        parent=styles["Title"],
        fontSize=18,
        textColor=colors.HexColor("#1a1a2e"),
        spaceAfter=6,
    )
    heading_style = ParagraphStyle(
        "Heading",
        parent=styles["Heading2"],
        fontSize=13,
        textColor=colors.HexColor("#C05000"),
        spaceBefore=14,
        spaceAfter=4,
    )
    normal_style = ParagraphStyle(
        "Normal",
        parent=styles["Normal"],
        fontSize=11,
        leading=16,
        textColor=colors.HexColor("#333333"),
    )
    bullet_style = ParagraphStyle(
        "Bullet",
        parent=styles["Normal"],
        fontSize=11,
        leading=16,
        leftIndent=16,
        textColor=colors.HexColor("#333333"),
    )

    story = []

    story.append(RLParagraph("CONSUMER COMPLAINT", title_style))
    story.append(RLParagraph("Under the Consumer Protection Act, 2019", normal_style))
    story.append(Spacer(1, 6))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#C05000")))
    story.append(Spacer(1, 12))

    # Case summary
    story.append(RLParagraph("CASE SUMMARY", heading_style))
    story.append(RLParagraph(f"<b>Against:</b> {req.defendant_name}", normal_style))
    story.append(RLParagraph(f"<b>Legal Category:</b> {req.legal_category}", normal_style))
    story.append(RLParagraph(f"<b>Claim Amount:</b> &#8377;{req.claim_amount:,.0f}", normal_style))
    story.append(RLParagraph(f"<b>Date of Incident:</b> {req.incident_date}", normal_style))
    story.append(RLParagraph(f"<b>AI Confidence Score:</b> {req.confidence_score}%  |  <b>Complexity:</b> {req.complexity}", normal_style))
    story.append(Spacer(1, 8))

    # Grievance
    story.append(RLParagraph("GRIEVANCE STATEMENT", heading_style))
    story.append(RLParagraph(req.translated_text, normal_style))
    story.append(Spacer(1, 8))

    # Legal sections
    story.append(RLParagraph("APPLICABLE LEGAL SECTIONS", heading_style))
    for section in req.legal_sections:
        story.append(RLParagraph(f"&#8226;  {section}", bullet_style))
    story.append(Spacer(1, 8))

    # Courtroom script
    story.append(RLParagraph("COURTROOM STATEMENT", heading_style))
    story.append(RLParagraph(req.courtroom_script, normal_style))
    story.append(Spacer(1, 16))

    story.append(HRFlowable(width="100%", thickness=0.5, color=colors.grey))
    story.append(Spacer(1, 6))
    story.append(
        RLParagraph(
            "<i>Generated by CourtMate AI — This document is for informational purposes only and does not constitute legal advice.</i>",
            ParagraphStyle("Disclaimer", parent=styles["Normal"], fontSize=9, textColor=colors.grey),
        )
    )

    doc.build(story)
    return FileResponse(
        tmp.name,
        filename="courtmate_complaint.pdf",
        media_type="application/pdf",
    )
