def score_candidate(data):
    candidates = data["candidates"]
    job = data["job"]

    ranked = []

    for c in candidates:
        score = len(set(c["skills"]) & set(job["skills"])) * 10
        ranked.append({**c, "score": score})

    ranked.sort(key=lambda x: x["score"], reverse=True)

    return ranked
