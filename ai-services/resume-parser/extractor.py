import re

SKILLS = ["python", "react", "node", "ml", "sql"]

def extract_entities(text: str):
    text = text.lower()

    skills = [s for s in SKILLS if s in text]

    education = re.findall(r"(b\.tech|m\.tech|mba)", text)
    experience = re.findall(r"\d+\s+years", text)

    return {
        "skills": skills,
        "education": education,
        "experience": experience,
    }
