from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import io

from .ocr import extract_text
from .allergy import find_allergy_hits
from .scoring import parse_nutrition, compute_score

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

KIDS = {
    "kid1": {
        "name": "Emma",
        "allergies": ["milk", "peanut"],
    }
}

def make_summary(child_name: str, allergy_hits: list[str], nutrition: dict, fit_score: int, fit_label: str) -> str:
    parts = []
    parts.append(f"Fit score: {fit_score} ({fit_label}).")

    if allergy_hits:
        parts.append(f"⚠️ Allergy risk: contains {', '.join(allergy_hits)} for {child_name}.")
    else:
        parts.append(f"No allergy triggers detected for {child_name}.")

    if nutrition.get("sugar_g") is not None:
        parts.append(f"Sugar: {nutrition['sugar_g']} g per serving.")
    if nutrition.get("sodium_mg") is not None:
        parts.append(f"Sodium: {nutrition['sodium_mg']} mg per serving.")

    parts.append("Tip: For kids, aim for lower added sugar and sodium; prefer whole-food snacks when possible.")
    return " ".join(parts)

@app.post("/scan-label")
async def scan_label(
    kid_id: str = Form(...),
    image: UploadFile = File(...)
):
    contents = await image.read()
    pil_image = Image.open(io.BytesIO(contents)).convert("RGB")

    extracted_text = extract_text(pil_image)

    allergies = KIDS.get(kid_id, KIDS["kid1"])["allergies"]
    allergy_hits = find_allergy_hits(extracted_text, allergies)

    nutrition = parse_nutrition(extracted_text)
    score, label, reasons = compute_score(nutrition, allergy_hits)

    summary = make_summary(KIDS.get(kid_id, KIDS["kid1"])["name"], allergy_hits, nutrition, score, label)

    return {
        "extracted_text": extracted_text,
        "summary": summary,
        "allergy_hits": allergy_hits,
        "nutrition": nutrition,
        "fit_score": score,
        "fit_label": label,
        "reasons": reasons,
    }