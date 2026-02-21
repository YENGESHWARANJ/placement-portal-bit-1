from fastapi import FastAPI, UploadFile, File
from parser import parse_resume

app = FastAPI(title="Resume Parser AI")

@app.post("/parse")
async def parse(file: UploadFile = File(...)):
    text = await file.read()
    result = parse_resume(text)
    return {"success": True, "data": result}
