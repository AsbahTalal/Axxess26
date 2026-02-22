def find_allergy_hits(text: str, allergies: list[str]):
    text = text.lower()
    hits = []

    for allergy in allergies:
        if allergy.lower() in text:
            hits.append(allergy)

    return hits