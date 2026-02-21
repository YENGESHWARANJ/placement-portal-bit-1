FROM python:3.11-slim

WORKDIR /app

COPY . .
RUN pip install --no-cache-dir \
    -r resume-parser/requirements.txt \
    -r ranking-engine/requirements.txt \
    -r skill-gap-analyzer/requirements.txt \
    -r analytics-engine/requirements.txt \
    fastapi \
    uvicorn \
    requests \
    python-multipart \
    python-docx \
    pdfplumber \
    pymupdf
RUN pip install \
    pytesseract \
    pillow \
    pdfplumber \
    python-docx \
    python-multipart



EXPOSE 8000

CMD ["uvicorn", "gateway:app", "--host", "0.0.0.0", "--port", "8000"]
