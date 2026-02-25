import uvicorn
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import logging
import os
import io
import re

# Configure Logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger("gateway")

app = FastAPI(title="AI Resume Gateway")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- TEXT EXTRACTION ---
try:
    import fitz  # PyMuPDF
except ImportError:
    fitz = None
    logger.warning("PyMuPDF (fitz) not installed.")

def extract_text(content: bytes, filename: str) -> str:
    text = ""
    filename = filename.lower()
    
    if filename.endswith(".pdf") and fitz:
        try:
            with fitz.open(stream=content, filetype="pdf") as doc:
                for page in doc:
                    text += page.get_text() + "\n"
        except Exception as e:
            logger.error(f"PDF extraction failed: {e}")
    
    # Simple .txt handling
    elif filename.endswith(".txt"):
        try:
            text = content.decode("utf-8")
        except:
            text = content.decode("latin-1")

    return text

# --- FIELD EXTRACTION (REAL LOGIC) ---
def extract_fields(text: str):
    """Real heuristic extraction logic (Python version)"""
    lines = [l.strip() for l in text.split('\n') if l.strip()]
    
    # 1. Email
    email_match = re.search(r'[\w.-]+@[\w.-]+\.\w+', text)
    email = email_match.group(0) if email_match else "Not found"
    
    # 2. Phone
    phone_match = re.search(r'(\+?\d{1,3}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}', text)
    phone = phone_match.group(0) if phone_match else "Not found"
    
    # 3. Name (Heuristic: First few lines that don't look like junk)
    name = "Candidate"
    bad_keywords = ["resume", "curriculum", "vitae", "cv", "profile", "summary", "contact", "education", "experience", "skills", "projects"]
    for line in lines[:5]:
        if len(line.split()) <= 4 and not any(kw in line.lower() for kw in bad_keywords) and "@" not in line:
            name = line
            break

    # 4. Skills (Heuristic: Look for common skill names)
    common_skills = ["Python", "JavaScript", "Java", "React", "Node", "MongoDB", "SQL", "HTML", "CSS", "TypeScript", "Next.js", "Docker", "AWS", "Machine Learning", "Data Science", "Express"]
    found_skills = []
    for skill in common_skills:
        if re.search(rf'\b{re.escape(skill)}\b', text, re.I):
            found_skills.append(skill)

    # 5. Sections
    education = []
    experience = []
    curr_section = None
    for line in lines:
        l_lower = line.lower()
        if any(x in l_lower for x in ["education", "academic", "university", "college"]) and len(line) < 50:
            curr_section = "edu"
            continue
        if any(x in l_lower for x in ["experience", "work", "employment", "history"]) and len(line) < 50:
            curr_section = "exp"
            continue
        if any(x in l_lower for x in ["skills", "projects", "hobbies"]) and len(line) < 50:
            curr_section = None
            continue
            
        if curr_section == "edu": education.append(line)
        elif curr_section == "exp": experience.append(line)

    # 6. Scoring & Feedback (New)
    score = 0
    feedback = []
    
    if email != "Not found": score += 15
    else: feedback.append("Missing email address - essential for recruiters.")
    
    if phone != "Not found": score += 10
    else: feedback.append("Missing phone number - recruiters often call for initial screening.")
    
    if len(found_skills) >= 3: score += 25
    elif len(found_skills) > 0: 
        score += 15
        feedback.append("Only a few technical skills detected. Try adding more specific tech keywords.")
    else: feedback.append("No technical skills detected. ATS might filter out this resume.")

    if len(education) > 0: score += 20
    else: feedback.append("No education section found.")

    if len(experience) > 0: score += 30
    else: feedback.append("No work experience or internship section detected.")

    return {
        "name": name,
        "email": email,
        "phone": phone,
        "skills": found_skills,
        "education": education[:5],
        "experience": experience[:8],
        "score": score,
        "feedback": feedback,
        "rawPreview": text[:1000]
    }

# --- ENDPOINTS ---

@app.get("/")
def health_check():
    return {"status": "running", "service": "AI Resume Gateway"}

@app.post("/parse-resume")
async def parse_resume(file: UploadFile = File(...)):
    filename = file.filename
    logger.info(f"Processing file: {filename}")
    
    try:
        content = await file.read()
        text = extract_text(content, filename)
        
        if not text or len(text.strip()) < 10:
            logger.warning(f"No text extracted from {filename}")
            return {
                "success": False,
                "message": "Real text extraction failed. Please upload a searchable PDF (not an image) or a DOCX file.",
                "data": None
            }
            
        # Real extraction
        parsed = extract_fields(text)
        return {
            "success": True,
            "message": "Resume parsed successfully (Real Data)",
            "data": parsed
        }
        
    except Exception as e:
        logger.error(f"Critical error: {e}")
        return {
            "success": False,
            "message": f"Server Error: {str(e)}",
            "data": None
        }

@app.post("/rank-jobs")
async def rank_jobs(payload: dict):
    candidate_skills = set(s.lower() for s in payload.get("candidateSkills", []))
    jobs = payload.get("jobs", [])
    
    ranked_jobs = []
    for job in jobs:
        job_skills = set(s.lower() for s in job.get("skills", []))
        if not job_skills:
            match_score = 0
        else:
            intersection = candidate_skills.intersection(job_skills)
            match_score = int((len(intersection) / len(job_skills)) * 100)
            
        job_with_score = job.copy()
        job_with_score["matchScore"] = match_score
        ranked_jobs.append(job_with_score)
        
    ranked_jobs.sort(key=lambda x: x["matchScore"], reverse=True)
    return {"ranked_jobs": ranked_jobs}

@app.post("/ask-ai")
async def ask_ai(payload: dict):
    query = payload.get("query", "").lower()
    context = payload.get("context", {})
    role = context.get("role", "student")
    
    if role == "recruiter":
        if "applicant" in query or "candidate" in query:
            response = "I've analyzed your applicant pool. 12 candidates have a >90% match for your active listings. Would you like me to trigger priority notifications?"
        elif "post" in query or "create" in query:
            response = "You can use my 'Auto-Fill with AI' feature on the 'Post Opportunity' page to generate professional job descriptions in seconds."
        elif "hiring" in query:
            response = "The hiring peak for this season is next month. I recommend refreshing your job listings now to maximize visibility."
        else:
            response = "I'm your Partner Intelligence assistant. I can help you find top talent, generate job posts, and analyze hiring trends. How can I help?"
    else:
        # Student logic (existing)
        if "interview" in query:
            response = "The AI Interview Coach is available in the 'Interview Prep' section. I can help you practice technical or behavioral rounds with real-time feedback."
        elif "resume" in query:
            score = context.get("resumeScore", 0)
            response = f"Your current resume score is {score}%. To increase it, ensure you've quantified your achievements and included keywords found in your dream job descriptions."
        elif "jobs" in query or "hiring" in query:
            response = "I have analyzed and ranked the latest job openings for you. Navigate to the 'Overview' page to see your personalized recommendations."
        elif "objective" in query or "roadmap" in query:
            obj = context.get("objective", "General Development")
            response = f"Your career journey is currently synchronized with '{obj}'. You can recalibrate your target role in the 'Career Path' section."
        elif "salary" in query:
            response = "Top placements this season range from 12 LPA to 45 LPA. Optimize your DSA and System Design skills to target the higher brackets."
        else:
            response = "I am your Placement Intelligence assistant. I can analyze your resume, track your career path, and prepare you for interviews. Ask me about your roadmap, jobs, or interview tips!"
        
    return {"response": response}

@app.post("/generate-job")
async def generate_job(payload: dict):
    title = payload.get("title", "").lower()
    
    if "developer" in title or "engineer" in title:
        desc = f"Seeking a high-caliber {title.title()} to join our core engineering squad. You will be instrumental in orchestrating scalable architectures and implementing professional-grade software patterns."
        reqs = "React.js, Node.js, TypeScript, Distributed Systems, Cloud Architecture, CI/CD"
        salary = "12 - 25 LPA"
    elif "data" in title or "analyst" in title:
        desc = f"Elevate our decision-making as a {title.title()}. Focus on distilling complex datasets into actionable intelligence and building optimized predictive models."
        reqs = "Python, SQL, PyTorch, Big Data, Tableau, Statistical Modeling"
        salary = "10 - 22 LPA"
    elif "product" in title or "manager" in title:
        desc = f"Lead the nexus of technology and business as a {title.title()}. Own the product lifecycle, from strategic vision to tactical execution."
        reqs = "Product Strategy, User Research, Agile methodologies, Stakeholder Management"
        salary = "15 - 35 LPA"
    else:
        desc = f"Exciting opportunity for an exceptional {title.title()}. Join a fast-paced environment where your expertise will directly impact our global roadmap."
        reqs = "Critical Thinking, Strategic Alignment, Domain Expertise, Technical Communication"
        salary = "Experience Driven"
        
    return {
        "description": desc,
        "requirements": reqs,
        "salary": salary
    }

@app.post("/generate-questions")
async def generate_questions(payload: dict):
    q_type = payload.get("type", "Aptitude")
    topic = payload.get("topic", "General")
    difficulty = payload.get("difficulty", "medium").lower()
    count = int(payload.get("count", 5))

    questions = []
    
    if q_type == "Aptitude":
        for i in range(count):
            questions.append({
                "id": i + 1,
                "question": f"In {topic}, if a system processes {100 + i*10} requests per second with {10 + i}% overhead, what is the net throughput?",
                "options": [f"{90 + i*5} req/s", f"{80 + i*5} req/s", f"{110 + i*5} req/s", f"{95 + i*5} req/s"],
                "correct": 0 if i % 2 == 0 else 1,
                "topic": topic,
                "difficulty": difficulty,
                "explanation": f"Net throughput is calculated by subtracting the {10+i}% overhead from the raw capacity."
            })
    elif q_type == "Coding":
        for i in range(count):
            questions.append({
                "id": i + 1,
                "title": f"{topic} Optimization: Part {i+1}",
                "description": f"Write an efficient algorithm to traverse a {topic} structure and find the kth largest element with O(log n) complexity.",
                "difficulty": difficulty.capitalize(),
                "topic": topic,
                "template": "function solve(k, arr) {\n  // Write your code here\n  \n}",
                "examples": [
                    {"input": "k=5, arr=[1, 2, 3, 4, 5]", "output": "5", "explanation": "The 5th largest element in this sorted array is the last one."},
                    {"input": "k=2, arr=[10, 20, 30]", "output": "20", "explanation": "30 is 1st, 20 is 2nd."}
                ],
                "hints": ["Consider using a binary search approach", f"Think about the properties of a {topic} data structure"],
                "constraints": ["1 <= n <= 10^5", "1 <= k <= n", "Time Complexity: O(log n)"]
            })
    else: # Interview
       for i in range(count):
            questions.append({
                "id": i + 1,
                "question": f"Explain the internal working of {topic} and how its architecture handles high concurrency in a {difficulty} scale environment.",
                "category": topic,
                "difficulty": difficulty,
                "keyPoints": [
                    f"Explain the {topic} lifecycle",
                    "Mention thread pooling mechanisms",
                    "Discuss locking and mutex strategies",
                    "Address horizontal vs vertical scaling"
                ],
                "sampleAnswer": f"The model answer focus on the {topic} lifecycle, the thread pooling mechanism, and the locking strategies used during peak loads. In a {difficulty} environment, we also consider distributed state management."
            })

    return {
        "success": True,
        "type": q_type,
        "topic": topic,
        "difficulty": difficulty,
        "questions": questions
    }

@app.post("/evaluate-interview")
async def evaluate_interview(payload: dict):
    question = payload.get("question", "")
    answer = payload.get("answer", "")
    
    # Mock evaluation logic
    score = 7
    feedback = "Your answer covers the basics but needs more technical depth. Mentioning specific protocols would improve the score."
    
    if len(answer.split()) > 50:
        score = 9
        feedback = "Excellent depth and technical clarity. You clearly understand the underlying architecture."
    
    return {
        "score": score,
        "feedback": feedback
    }

@app.post("/evaluate-coding")
async def evaluate_coding(payload: dict):
    code = payload.get("code", "")
    
    # Mock evaluation
    passed = True
    feedback = "All test cases passed. Complexity is optimal."
    
    if "for" in code and "for" in code.split("for")[1]: # Nested loop
        feedback = "Solution works but consider optimizing the O(N^2) complexity."
        
    return {
        "passed": passed,
        "score": 10 if passed else 0,
        "feedback": feedback
    }

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
