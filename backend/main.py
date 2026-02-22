"""
FastAPI backend: kid-level AI summaries from Desktop/Datasets.
For hackathon: integrate the 'summary' as a tab in each kid's profile on the frontend.
"""
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

from data_loader import get_all_kid_names
from summary_generator import generate_summary_for_kid, generate_all_summaries

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


@app.get("/kids/{kid_name}/summary")
def get_kid_summary(
    kid_name: str,
    include_raw: bool = Query(False, description="Include full raw_data for debugging"),
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
    include_raw: bool = Query(False, description="Include full raw_data per kid"),
    use_llm: bool = Query(True, description="Use OpenAI to enhance summaries when API key is set"),
):
    """Fetch summaries for all kids in one call (e.g. for dashboard or preload)."""
    results = generate_all_summaries(use_llm=use_llm)
    if not include_raw:
        results = [{k: v for k, v in r.items() if k != "raw_data"} for r in results]
    return {"summaries": results}
