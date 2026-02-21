"""
Generate AI-style summaries for each kid from aggregated data.
Designed for display in a "Summary" tab on each kid's profile in the frontend.
When OPENAI_API_KEY is set, uses OpenAI to produce a natural-language summary.
"""
import re
from typing import Any

from data_loader import aggregate_kid_data, get_all_kid_names

try:
    from openai import OpenAI
except ImportError:
    OpenAI = None

from config import OPENAI_API_KEY, OPENAI_MODEL


def _format_medical(rec: dict) -> str:
    parts = [rec.get("medication_name", "")]
    if rec.get("dosage"):
        parts.append(f"dosage {rec['dosage']}")
    if rec.get("frequency"):
        parts.append(f"({rec['frequency']})")
    if rec.get("allergies") and str(rec["allergies"]).lower() != "none":
        parts.append(f"— Allergies: {rec['allergies']}")
    return " ".join(str(p) for p in parts if p)


def _format_vaccination(v: dict) -> str:
    s = f"{v.get('vaccine_name', '')} on {v.get('date_administered', '')}"
    if v.get("next_due"):
        s += f", next due {v['next_due']}"
    return s

def _build_template_summary(data: dict[str, Any]) -> tuple[str, list[str]]:
  """Build template summary and highlights from aggregated kid data. Returns (full_summary, highlights)."""
    kid_name = data.get("kid_name", "")
    sections: list[str] = []
    profile = data.get("profile") or {}
    name = data.get("kid_name", kid_name)
    age = profile.get("age")
    gender = profile.get("gender")
    intro = f"{name}"
    if age is not None:
        intro += f", {age} years old"
    if gender:
        intro += f", {gender}"
    intro += "."
    sections.append(intro)

    medical = data.get("medical_records") or []
    if medical:
        lines = ["**Medical & medications**"]
        for m in medical:
            lines.append(f"• {_format_medical(m)}")
        sections.append("\n".join(lines))

    vitals = data.get("vitals") or {}
    if vitals and (vitals.get("latest_systolic_bp") or vitals.get("latest_heart_rate_bpm")):
        vparts = []
        if vitals.get("latest_systolic_bp") is not None and vitals.get("latest_diastolic_bp") is not None:
            vparts.append(f"BP {vitals['latest_systolic_bp']}/{vitals['latest_diastolic_bp']} mmHg")
        if vitals.get("latest_heart_rate_bpm") is not None:
            vparts.append(f"heart rate {vitals['latest_heart_rate_bpm']} bpm")
        if vparts:
            sections.append("**Recent vitals**\n" + ", ".join(vparts))

    vaccinations = data.get("vaccinations") or []
    if vaccinations:
        lines = ["**Vaccinations**"]
        for v in vaccinations:
          lines.append(f"• {_format_vaccination(v)}")
        sections.append("\n".join(lines))

    bmi = data.get("bmi") or {}
    if bmi and bmi.get("bmi_category"):
        bmi_line = f"**Growth** — Height {bmi.get('height_cm')} cm, weight {bmi.get('weight_kg')} kg, BMI {bmi.get('bmi')} ({bmi.get('bmi_category')})"
        sections.append(bmi_line)

    sleep = data.get("sleep") or {}
    if sleep.get("avg_sleep_hours") is not None:
        s = f"**Sleep** — Average {sleep['avg_sleep_hours']:.1f} hours"
        if sleep.get("recent_bed_time") and sleep.get("recent_wake_time"):
            s += f"; recent schedule ~{sleep['recent_bed_time']} to {sleep['recent_wake_time']}"
        sections.append(s + ".")

    exercise = data.get("exercise") or []
    if exercise:
        by_type: dict[str, list[int]] = {}
        for e in exercise:
            t = e.get("exercise_type") or "Other"
            by_type.setdefault(t, []).append(int(e.get("duration_minutes", 0)))
          parts = [f"{t} ({sum(durs)} min total)" for t, durs in by_type.items()]
        sections.append("**Activity** — " + "; ".join(parts))

    school = data.get("school_mood") or []
    if school:
        ratings = [s.get("mood_rating") for s in school if s.get("mood_rating") is not None]
        avg_mood = sum(ratings) / len(ratings) if ratings else None
        recent_notes = [s.get("notes") for s in school[-3:] if s.get("notes")]
        mood_line = "**School & mood**"
        if avg_mood is not None:
            mood_line += f" — Average mood rating {avg_mood:.1f}/5"
        if recent_notes:
            mood_line += ". Recent notes: " + "; ".join(str(n) for n in recent_notes[:3])
        sections.append(mood_line)

    reminders = data.get("reminders") or []
    pending = [r for r in reminders if str(r.get("status", "")).lower() == "pending"]
    if pending:
        sections.append("**Reminders** — " + ", ".join(r.get("reminder_type", "") for r in pending) + " pending.")

    full_summary = "\n\n".join(sections)

    highlights = []
    if medical:
        highlights.append(f"{len(medical)} medication(s); allergies noted" if any(
            str(m.get("allergies", "")).lower() not in ("none", "") for m in medical
        ) else f"{len(medical)} medication(s)")
    if bmi and bmi.get("bmi_category"):
        highlights.append(f"BMI: {bmi['bmi_category']}")
    if vaccinations:
        next_due = [v for v in vaccinations if v.get("next_due")]
        if next_due:
            highlights.append(f"{len(next_due)} vaccination(s) with upcoming due date(s)")
   return full_summary, highlights


def _enhance_with_openai(kid_name: str, template_summary: str, raw_data: dict[str, Any]) -> tuple[str, list[str]] | None:
    """Call OpenAI to produce a short natural-language summary. Returns (summary, highlights) or None on failure."""
    if not OPENAI_API_KEY or OpenAI is None:
        return None
    system_prompt = """You are a concise pediatric summary assistant. Given structured data for one child, output:
1. A short, friendly paragraph (2-4 sentences) summarizing their health and routine. Include all medical info: medications, allergies, vitals, vaccinations, growth, sleep, and activity. Be factual and clear.
2. On a new line write exactly: HIGHLIGHTS:
3. Then 2-4 bullet points (one per line), each starting with a hyphen, for quick scanning."""
    try:
        client = OpenAI(api_key=OPENAI_API_KEY)
        response = client.chat.completions.create(
            model=OPENAI_MODEL,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"Child: {kid_name}\n\nData:\n{template_summary}"},
            ],
            max_tokens=500,
        )
        text = (response.choices[0].message.content or "").strip()
        if not text:
            return None
        parts = re.split(r"\s*HIGHLIGHTS:\s*", text, flags=re.IGNORECASE, maxsplit=1)
        summary = parts[0].strip()
        highlights = []
        if len(parts) > 1:
            for line in parts[1].strip().split("\n"):
                line = line.strip()
                if line.startswith("-"):
                    line = line[1:].strip()
                if line:
                    highlights.append(line)
        if not highlights:
            highlights = [summary[:80] + "..." if len(summary) > 80 else summary]
        return summary, highlights
    except Exception:
        return None


def generate_summary_for_kid(kid_name: str, use_llm: bool = True) -> dict[str, Any]:
    """
    Build a structured AI summary for one kid, including medical records.
    When use_llm is True and OPENAI_API_KEY is set, enhances with OpenAI. Otherwise uses template.
    Returns dict with 'summary' (full text), 'highlights', and 'raw_data' for the frontend tab.
    """
    data = aggregate_kid_data(kid_name)
    template_summary, template_highlights = _build_template_summary(data)
    full_summary = template_summary
    highlights = template_highlights

    if use_llm:
        enhanced = _enhance_with_openai(kid_name, template_summary, data)
        if enhanced is not None:
            full_summary, highlights = enhanced

    return {
        "kid_name": kid_name,
        "summary": full_summary,
        "highlights": highlights,
        "raw_data": data,
    }


def generate_all_summaries(use_llm: bool = True) -> list[dict[str, Any]]:
    """Generate summary for every kid in the datasets. For batch use or admin."""
    kids = get_all_kid_names()
    return [generate_summary_for_kid(name, use_llm=use_llm) for name in kids]
