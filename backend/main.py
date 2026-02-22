"""
FastAPI backend: kid-level AI summaries from Desktop/Datasets or parent-entered data.
For hackathon: parent dashboard with AI Summary tab per child.
"""
from typing import Any

from fastapi import Body, FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

from data_loader import get_all_kid_names
from summary_generator import (
    generate_summary_for_kid,
    generate_summary_from_data,
    generate_all_summaries,
)

app = FastAPI(
    title="Kid Summary API",
    description="AI summaries per kid including medical records, for profile Summary tab.",
    version="1.0.0",
)

# Allow frontend (any origin for hackathon; tighten in production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/kids")
def list_kids():
    """List all kid names. Frontend can use these for profile routes/tabs."""
    names = get_all_kid_names()
    return {"kids": names}


@app.get("/overview")
def get_overview():
    """One overview paragraph per kid (Liam, Sophia, etc.). No raw_data, no highlights."""
    kids = get_all_kid_names()
    result: dict[str, str] = {}
    for name in kids:
        summary_result = generate_summary_for_kid(name, use_llm=False)
        paragraph = (summary_result.get("summary") or "").replace("\n\n", " ").replace("\n", " ").strip()
        result[name] = paragraph
    return result


@app.post("/summary")
def post_summary_from_data(
    body: dict[str, Any] = Body(
        ...,
        example={
            "kid_name": "Liam Johnson",
            "profile": {"kid_name": "Liam Johnson", "age": 6, "gender": "Male", "parent_name": "Emily Johnson"},
            "medical_records": [{"medication_name": "Albuterol", "dosage": "2", "frequency": "As needed", "allergies": "Peanuts"}],
            "vitals": {"latest_systolic_bp": 102, "latest_diastolic_bp": 65, "latest_heart_rate_bpm": 92},
            "vaccinations": [{"vaccine_name": "MMR", "date_administered": "2023-08-10", "next_due": None}],
            "bmi": {"height_cm": 116, "weight_kg": 20.5, "bmi": 15.2, "bmi_category": "Healthy"},
            "sleep": {"avg_sleep_hours": 10.25, "recent_bed_time": "20:30", "recent_wake_time": "7:00"},
            "exercise": [{"exercise_type": "Soccer", "duration_minutes": 45, "date": "2026-02-15"}],
            "school_mood": [{"date": "2026-02-15", "had_fun": "yes"}],
            "reminders": [{"reminder_type": "Drink Water", "time": "10:00", "status": "Completed", "date": "2026-02-15"}],
        },
    ),
    use_llm: bool = Query(True, description="Use OpenAI to enhance summary when API key is set"),
):
    """
    Generate AI summary from parent-entered child data (dashboard). Send one child's data as JSON;
    returns one overview paragraph for the AI Summary tab. Body shape matches aggregated kid data
    (kid_name, profile, medical_records, vitals, vaccinations, bmi, sleep, exercise, school_mood, reminders).
    """
    if not body or "kid_name" not in body:
        raise HTTPException(422, detail="Request body must include 'kid_name'.")
    result = generate_summary_from_data(body, use_llm=use_llm)
    paragraph = (result.get("summary") or "").replace("\n\n", " ").replace("\n", " ").strip()
    return {"kid_name": result["kid_name"], "summary": paragraph}
   


@app.get("/kids/{kid_name}/summary")
def get_kid_summary(
    kid_name: str,
    include_raw: bool = Query(True, description="Include full raw_data for debugging"),
    use_llm: bool = Query(True, description="Use OpenAI to enhance summary when API key is set"),
):
    """
    Get the AI summary for one kid. Use this for the Summary tab on that kid's profile.
    kid_name should be URL-encoded (e.g. "Liam%20Johnson" for "Liam Johnson").
    """
    all_names = get_all_kid_names()
    normalized = kid_name.replace("+", " ").strip()
    matched = next((n for n in all_names if n.lower() == normalized.lower()), None)
    if not matched:
        raise HTTPException(404, detail=f"Kid not found: {kid_name}")
    result = generate_summary_for_kid(matched, use_llm=use_llm)
    if not include_raw:
        result = {k: v for k, v in result.items() if k != "raw_data"}
    return result


@app.get("/summaries")
def get_all_kid_summaries(
    include_raw: bool = Query(True, description="Include full raw_data per kid"),
    use_llm: bool = Query(True, description="Use OpenAI to enhance summaries when API key is set"),
):
    """Fetch summaries for all kids in one call (e.g. for dashboard or preload)."""
    results = generate_all_summaries(use_llm=use_llm)
    if not include_raw:
        results = [{k: v for k, v in r.items() if k != "raw_data"} for r in results]
    return {"summaries": results}

from fastapi import FastAPI
from pydantic import BaseModel
from openai import OpenAI
from dotenv import load_dotenv
import os

load_dotenv()

api_key = os.getenv("OPENAI_API_KEY")

if not api_key:
    raise ValueError("OPENAI_API_KEY not found!")

client = OpenAI(api_key=api_key)

app = FastAPI()

class ChildData(BaseModel):
    name: str
    age: int
    bmi: float
    latest_heart_rate_bpm: int
    sleep_avg_hours: float
    durations_minutes: int

@app.post("/add-child/{parent_name}")
def add_child(parent_name: str, data: ChildData):
    if parent_name not in parents:
        parents[parent_name] = {"children": {}}
    
    child_id = f"child{len(parents[parent_name]['children']) + 1}"
    parents[parent_name]["children"][kid_name] = child_data.dict()
    
    return {"message": "Child added", "kid_name": kid_name}

@app.get("/ai-summary/{parent_name}/{kid_name}")
def ai_summary(parent_name: str, kid_name: str):

    child_data = parents[parent_name]["children"][kid_name]

    prompt = f"""
    You are a pediatric health assistant.

    Child Data:
    {child_data}

    Provide:
    1. Overall summary
    2. Mild concerns
    3. One recommendation
    """

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are a pediatric health expert."},
            {"role": "user", "content": prompt}
        ]
    )

    return {"summary": response.choices[0].message.content}
