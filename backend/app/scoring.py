import re

def parse_nutrition(text: str):
    text = text.lower()

    sugar = None
    sodium = None

    sugar_match = re.search(r"sugars?\s+(\d+)\s*g", text)
    if sugar_match:
        sugar = int(sugar_match.group(1))

    sodium_match = re.search(r"sodium\s+(\d+)\s*mg", text)
    if sodium_match:
        sodium = int(sodium_match.group(1))

    return {
        "sugar_g": sugar,
        "sodium_mg": sodium
    }

def compute_score(nutrition, allergy_hits):
    score = 85
    reasons = []

    if allergy_hits:
        score -= 60
        reasons.append("Contains allergy ingredient")

    if nutrition["sugar_g"] and nutrition["sugar_g"] > 15:
        score -= 25
        reasons.append("High sugar")

    if nutrition["sodium_mg"] and nutrition["sodium_mg"] > 400:
        score -= 20
        reasons.append("High sodium")

    score = max(0, min(score, 100))

    if score >= 70:
        label = "Green"
    elif score >= 40:
        label = "Yellow"
    else:
        label = "Red"

    return score, label, reasons