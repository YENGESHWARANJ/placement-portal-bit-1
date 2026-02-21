def analyze_gap(data):
    skills = set(data["skills"])
    required = set(data["jobSkills"])

    missing = list(required - skills)

    return {
        "missingSkills": missing,
        "suggestions": missing[:3]
    }
