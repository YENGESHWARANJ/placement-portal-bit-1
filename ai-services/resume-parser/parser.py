from extractor import extract_entities

def parse_resume(raw_bytes):
    text = raw_bytes.decode(errors="ignore")
    entities = extract_entities(text)

    return {
        "skills": entities["skills"],
        "education": entities["education"],
        "experience": entities["experience"],
    }
