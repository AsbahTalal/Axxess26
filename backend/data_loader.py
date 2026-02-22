"""Load and aggregate all kid-related datasets for summary generation."""
from pathlib import Path
from typing import Any

import pandas as pd

from config import DATASETS_PATH


def _read_csv(name: str) -> pd.DataFrame:
    path = DATASETS_PATH / name
    if not path.exists():
        return pd.DataFrame()
    return pd.read_csv(path).dropna(how="all", axis=1)


def load_profiles() -> pd.DataFrame:
    return _read_csv("kids_profile.csv")


def load_medical_info() -> pd.DataFrame:
    return _read_csv("medical_info.csv")


def load_vitals() -> pd.DataFrame:
    return _read_csv("vitals_log.csv")


def load_vaccinations() -> pd.DataFrame:
    return _read_csv("vaccinations.csv")


def load_bmi() -> pd.DataFrame:
    return _read_csv("kids_bmi.csv")


def load_sleep() -> pd.DataFrame:
    return _read_csv("sleep_patterns.csv")


def load_exercise() -> pd.DataFrame:
    return _read_csv("exercise_log.csv")


def load_school_rating() -> pd.DataFrame:
    return _read_csv("school_day_rating.csv")


def load_reminders() -> pd.DataFrame:
    return _read_csv("reminders.csv")


def get_all_kid_names() -> list[str]:
    profiles = load_profiles()
    if profiles.empty or "kid_name" not in profiles.columns:
        return []
    return profiles["kid_name"].dropna().unique().tolist()


def aggregate_kid_data(kid_name: str) -> dict[str, Any]:
    """Aggregate all available data for one kid into a single dict for summary."""
    profiles = load_profiles()
    medical = load_medical_info()
    vitals = load_vitals()
    vaccinations = load_vaccinations()
    bmi = load_bmi()
    sleep = load_sleep()
    exercise = load_exercise()
    school = load_school_rating()
    reminders = load_reminders()

    profile_row = (
        profiles[profiles["kid_name"] == kid_name].iloc[0]
        if not profiles.empty and (profiles["kid_name"] == kid_name).any()
        else None
    )

    def _filter(df: pd.DataFrame, col: str = "kid_name") -> pd.DataFrame:
        if df.empty or col not in df.columns:
            return pd.DataFrame()
        return df[df[col] == kid_name]

    medical_df = _filter(medical)
    vitals_df = _filter(vitals)
    vacc_df = _filter(vaccinations)
    bmi_df = _filter(bmi)
    sleep_df = _filter(sleep)
    exercise_df = _filter(exercise)
    school_df = _filter(school)
    reminders_df = _filter(reminders)

    out: dict[str, Any] = {
        "kid_name": kid_name,
        "profile": {},
        "medical_records": [],
        "vitals": {},
        "vaccinations": [],
        "bmi": {},
        "sleep": {},
        "exercise": [],
        "school_mood": [],
        "reminders": [],
    }

    if profile_row is not None:
        out["profile"] = {
            "kid_name": str(profile_row.get("kid_name", kid_name)),
            "age": int(profile_row["age"]) if pd.notna(profile_row.get("age")) else None,
            "gender": str(profile_row["gender"]) if pd.notna(profile_row.get("gender")) else None,
            "parent_name": str(profile_row["parent_name"]) if pd.notna(profile_row.get("parent_name")) else None,
        }

    for _, r in medical_df.iterrows():
        out["medical_records"].append({
            "medication_name": r.get("medication_name"),
            "dosage": r.get("dosage"),
            "frequency": r.get("frequency"),
            "allergies": r.get("allergies"),
        })

    if not vitals_df.empty:
        out["vitals"] = {
            "latest_systolic_bp": int(vitals_df["systolic_bp"].iloc[-1]) if "systolic_bp" in vitals_df else None,
            "latest_diastolic_bp": int(vitals_df["diastolic_bp"].iloc[-1]) if "diastolic_bp" in vitals_df else None,
            "latest_heart_rate_bpm": int(vitals_df["heart_rate_bpm"].iloc[-1]) if "heart_rate_bpm" in vitals_df else None,
            "records_count": len(vitals_df),
        }

    for _, r in vacc_df.iterrows():
        out["vaccinations"].append({
            "vaccine_name": r.get("vaccine_name"),
            "date_administered": str(r.get("date_administered")),
            "next_due": str(r.get("next_due")) if pd.notna(r.get("next_due")) else None,
        })

    if not bmi_df.empty:
        latest_bmi = bmi_df.iloc[-1]
        out["bmi"] = {
            "height_cm": float(latest_bmi.get("height_cm")),
            "weight_kg": float(latest_bmi.get("weight_kg")),
            "bmi": float(latest_bmi.get("bmi")),
            "bmi_category": str(latest_bmi.get("bmi_category", "")),
            "records_count": len(bmi_df),
        }

    if not sleep_df.empty:
        total_col = "total_sleep_hours" if "total_sleep_hours" in sleep_df.columns else None
        out["sleep"] = {
            "avg_sleep_hours": float(sleep_df[total_col].mean()) if total_col else None,
            "recent_bed_time": str(sleep_df["bed_time"].iloc[-1]) if "bed_time" in sleep_df else None,
            "recent_wake_time": str(sleep_df["wake_time"].iloc[-1]) if "wake_time" in sleep_df else None,
            "records_count": len(sleep_df),
        }

    for _, r in exercise_df.iterrows():
        out["exercise"].append({
            "exercise_type": r.get("exercise_type"),
            "duration_minutes": r.get("duration_minutes"),
            "date": str(r.get("date")),
        })

    for _, r in school_df.iterrows():
        out["school_mood"].append({
            "date": str(r.get("date")),
            "had_fun": r.get("had_fun"),
        })

    for _, r in reminders_df.iterrows():
        out["reminders"].append({
            "reminder_type": r.get("reminder_type"),
            "time": str(r.get("time")),
            "status": r.get("status"),
            "date": str(r.get("date")),
        })

    return out
