from fastapi import FastAPI
from scorer import score_candidate

app = FastAPI(title="Ranking Engine")

@app.post("/rank")
async def rank(payload: dict):
    scores = score_candidate(payload)
    return {"success": True, "ranking": scores}
