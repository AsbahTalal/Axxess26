"""Configuration for datasets path and optional AI."""
import os
from pathlib import Path

from dotenv import load_dotenv

load_dotenv()

# Datasets path: env > project datasets/ > ~/Desktop/Datasets (for local + deploy)
_project_dir = Path(__file__).resolve().parent
_candidates = [
    os.environ.get("DATASETS_PATH"),
    str(_project_dir / "datasets"),
    str(Path.home() / "Desktop" / "Datasets"),
]
DATASETS_PATH = None
for p in _candidates:
    if p and Path(p).exists():
        DATASETS_PATH = Path(p)
        break
if DATASETS_PATH is None:
    DATASETS_PATH = Path(_candidates[1])  # prefer project datasets/ for clear error
assert DATASETS_PATH.exists(), f"Datasets folder not found. Tried: {_candidates}"

# OpenAI: optional; when set, summaries are enhanced with LLM
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")
OPENAI_MODEL = os.environ.get("OPENAI_MODEL", "gpt-4o-mini")
