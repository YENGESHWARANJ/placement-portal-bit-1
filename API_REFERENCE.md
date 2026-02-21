# 🔌 API Endpoints Reference

## Base URLs
- **Backend API**: `http://localhost:5000/api`
- **AI Services**: `http://localhost:8000`

---

## 🔐 Authentication

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "student@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1...",
  "user": {
    "_id": "...",
    "name": "John Doe",
    "email": "student@example.com",
    "role": "student"
  }
}
```

### Register Student
```http
POST /students/register
Content-Type: application/json

{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "securepass",
  "usn": "1CR21CS001",
  "branch": "CSE",
  "year": 3,
  "cgpa": 8.5
}
```

### Get Current User
```http
GET /auth/me
Authorization: Bearer {token}
```

---

## 👨‍🎓 Student Endpoints

### Get Student Profile
```http
GET /students/profile
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "John Doe",
    "usn": "1CR21CS001",
    "branch": "CSE",
    "year": 3,
    "cgpa": 8.5,
    "skills": ["React", "Node.js", "MongoDB"],
    "resumeScore": 85,
    "status": "Unplaced",
    "company": null
  }
}
```

### Update Student Profile
```http
POST /students/profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "cgpa": 8.7,
  "year": 4,
  "skills": ["React", "TypeScript", "AWS"],
  "about": "Passionate developer..."
}
```

---

## 💼 Job Endpoints

### Get All Jobs
```http
GET /jobs
Authorization: Bearer {token}
```

**Response:**
```json
{
  "jobs": [
    {
      "_id": "...",
      "title": "Full Stack Developer",
      "company": "TechCorp",
      "location": "Bangalore",
      "type": "Full-time",
      "salary": "12-15 LPA",
      "requirements": ["React", "Node.js"],
      "description": "We are looking for...",
      "deadline": "2026-03-31T00:00:00.000Z",
      "createdAt": "2026-02-15T10:30:00.000Z",
      "applicantsCount": 45,
      "active": true
    }
  ]
}
```

### Get Recommended Jobs (AI-Powered)
```http
GET /jobs/recommendations
Authorization: Bearer {token}
```

**Response:**
```json
{
  "jobs": [
    {
      "_id": "...",
      "title": "Frontend Developer",
      "company": "StartupXYZ",
      "matchScore": 92,
      ...
    }
  ]
}
```

### Create Job (Recruiter Only)
```http
POST /jobs
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Backend Developer",
  "company": "MyCompany",
  "location": "Remote",
  "type": "Full-time",
  "salary": "10-12 LPA",
  "description": "Looking for skilled backend developers...",
  "requirements": ["Node.js", "PostgreSQL", "Docker"],
  "deadline": "2026-04-15"
}
```

### Get My Jobs (Recruiter Only)
```http
GET /jobs/my
Authorization: Bearer {token}
```

### Delete Job (Recruiter Only)
```http
DELETE /jobs/:jobId
Authorization: Bearer {token}
```

---

## 📝 Application Endpoints

### Apply for Job
```http
POST /applications
Authorization: Bearer {token}
Content-Type: application/json

{
  "jobId": "65f1a2b3c4d5e6f7g8h9i0j1"
}
```

**Response:**
```json
{
  "message": "Application submitted successfully",
  "application": {
    "_id": "...",
    "jobId": "...",
    "studentId": "...",
    "status": "Applied",
    "createdAt": "2026-02-17T12:15:00.000Z"
  }
}
```

### Get My Applications (Student)
```http
GET /applications/my
Authorization: Bearer {token}
```

**Response:**
```json
{
  "applications": [
    {
      "_id": "...",
      "jobId": {
        "title": "Full Stack Developer",
        "company": "TechCorp",
        "location": "Bangalore"
      },
      "status": "Shortlisted",
      "createdAt": "2026-02-10T08:30:00.000Z"
    }
  ]
}
```

### Get Job Applicants (Recruiter)
```http
GET /applications/job/:jobId
Authorization: Bearer {token}
```

**Response:**
```json
{
  "applications": [
    {
      "_id": "...",
      "studentId": {
        "name": "John Doe",
        "usn": "1CR21CS001",
        "branch": "CSE",
        "cgpa": 8.5,
        "skills": ["React", "Node.js"]
      },
      "status": "Applied",
      "createdAt": "2026-02-17T10:00:00.000Z"
    }
  ]
}
```

### Update Application Status (Recruiter)
```http
PUT /applications/:applicationId
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "Shortlisted"
}
```

**Valid Statuses:**
- `Applied`
- `Shortlisted`
- `Assessment`
- `Interview`
- `Offered`
- `Rejected`

---

## 🛣️ Career Roadmap

### Get Roadmap
```http
GET /roadmap
Authorization: Bearer {token}
```

**Response:**
```json
{
  "roadmap": [
    {
      "id": 1,
      "title": "Core Mastery",
      "status": "completed",
      "description": "Synthesizing your core foundations...",
      "tasks": ["Data Structures", "Algorithms", "System Design"],
      "progress": 100
    },
    {
      "id": 2,
      "title": "Elite Full Stack Developer Specialization",
      "status": "in-progress",
      "description": "Deep dive into advanced architectures...",
      "tasks": ["Performance Optimization", "Microservices Design"],
      "progress": 45
    }
  ],
  "objective": "Full Stack Developer"
}
```

### Update Career Objective
```http
POST /roadmap/align
Authorization: Bearer {token}
Content-Type: application/json

{
  "objective": "DevOps Engineer"
}
```

---

## 📊 Analytics Endpoints

### Admin Dashboard Stats
```http
GET /analytics/admin-stats
Authorization: Bearer {token}
```

**Response:**
```json
{
  "stats": {
    "totalStudents": 350,
    "placedStudents": 215,
    "totalJobs": 45,
    "totalCompanies": 28,
    "placementRate": 61
  },
  "placementTrend": [...],
  "departmentStats": [...]
}
```

### Recruiter Dashboard Stats
```http
GET /analytics/recruiter-stats
Authorization: Bearer {token}
```

**Response:**
```json
{
  "stats": {
    "totalJobs": 12,
    "totalApplicants": 156,
    "shortlistedCount": 42,
    "interviewCount": 18
  },
  "recentApplications": [...],
  "pipeline": [
    { "name": "Applied", "value": 78, "color": "#6366f1" },
    { "name": "Shortlisted", "value": 42, "color": "#d946ef" },
    { "name": "Interviews", "value": 18, "color": "#f43f5e" },
    { "name": "Hired", "value": 8, "color": "#10b981" }
  ]
}
```

---

## 🤖 AI Service Endpoints

### Parse Resume
```http
POST http://localhost:8000/parse-resume
Content-Type: multipart/form-data

file: <PDF or DOCX file>
```

**Response:**
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "phone": "+91-9876543210",
  "skills": ["Python", "Machine Learning", "Docker"],
  "education": "B.Tech in Computer Science",
  "experience": "2 years"
}
```

### Rank Jobs (Match Student with Jobs)
```http
POST http://localhost:8000/rank-jobs
Content-Type: application/json

{
  "student_skills": ["React", "Node.js", "MongoDB"],
  "jobs": [
    {
      "id": "1",
      "title": "MERN Developer",
      "requirements": ["React", "MongoDB", "Express"]
    }
  ]
}
```

**Response:**
```json
{
  "ranked_jobs": [
    {
      "job_id": "1",
      "match_score": 85,
      "matched_skills": ["React", "MongoDB"],
      "missing_skills": ["Express"]
    }
  ]
}
```

---

## 🏢 Company Endpoints

### Get All Companies
```http
GET /jobs/companies
Authorization: Bearer {token}
```

**Response:**
```json
{
  "companies": ["TechCorp", "StartupXYZ", "InnovateLabs", ...]
}
```

---

## 🔄 Error Responses

### Unauthorized (401)
```json
{
  "message": "Unauthorized"
}
```

### Validation Error (400)
```json
{
  "message": "Missing required fields"
}
```

### Not Found (404)
```json
{
  "message": "Resource not found"
}
```

### Server Error (500)
```json
{
  "message": "Internal server error"
}
```

---

## 📝 Notes

1. **Authentication**: All endpoints (except `/auth/login` and `/students/register`) require a valid JWT token in the `Authorization` header.

2. **Token Refresh**: The frontend automatically refreshes tokens using the interceptor in `api.ts`. Refresh tokens are stored as HTTP-only cookies.

3. **Rate Limiting**: API has rate limiting enabled (100 requests per 15 minutes per IP).

4. **CORS**: Configured to allow requests from `http://localhost:5173` in development.

5. **Date Formats**: All dates are in ISO 8601 format (e.g., `2026-02-17T12:15:30.000Z`).

6. **ObjectIds**: MongoDB ObjectIds are 24-character hexadecimal strings.

---

## 🧪 Testing with cURL

### Login Example
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "student@test.com", "password": "password123"}'
```

### Get Jobs Example
```bash
curl -X GET http://localhost:5000/api/jobs \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Apply for Job Example
```bash
curl -X POST http://localhost:5000/api/applications \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"jobId": "65f1a2b3c4d5e6f7g8h9i0j1"}'
```

---

**Last Updated:** 2026-02-17  
**API Version:** v1
