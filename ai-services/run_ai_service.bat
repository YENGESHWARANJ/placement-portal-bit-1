@echo off
echo Installing dependencies (this may take a minute)...
pip install -qq fastapi uvicorn python-multipart python-docx pdfplumber pymupdf Pillow requests tqdm

echo Starting AI Service...
python -m uvicorn gateway:app --host 0.0.0.0 --port 8000 --reload
pause
