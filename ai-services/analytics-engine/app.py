from fastapi import FastAPI
from trends import predict_trends

app = FastAPI(title="Analytics AI")

@app.post("/predict")
async def predict(payload: dict):
    return predict_trends(payload)
