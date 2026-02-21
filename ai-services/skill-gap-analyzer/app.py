from fastapi import FastAPI
from analyzer import analyze_gap

app = FastAPI(title="Skill Gap AI")

@app.post("/analyze")
async def analyze(payload: dict):
    return analyze_gap(payload)
