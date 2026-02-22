# app/main.py
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

# Fake kid data (replace later with DB)
KIDS = {
    "kid1": {
        "name": "Ayaan",
        "allergies": ["peanut", "milk"]
    }
}

@app.get("/")
def home():
    return {"message": "Nutrition Camera API running"}

@app.post("/scan-label")
async def scan_label(
    kid_id: str = Form(...),
    image: UploadFile = File(...)
):
    if kid_id not in KIDS:
        return {"error": "Kid not found"}

    contents = await image.read()
    pil_image = Image.open(io.BytesIO(contents))

    extracted_text = extract_text(pil_image)

    allergies = KIDS[kid_id]["allergies"]
    allergy_hits = find_allergy_hits(extracted_text, allergies)

    nutrition = parse_nutrition(extracted_text)
    score, label, reasons = compute_score(nutrition, allergy_hits)

    return {
        "extracted_text": extracted_text,
        "allergy_hits": allergy_hits,
        "nutrition": nutrition,
        "fit_score": score,
        "fit_label": label,
        "reasons": reasons
    }