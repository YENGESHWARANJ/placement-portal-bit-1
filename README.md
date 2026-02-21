# 🚀 Quick Start Guide - AI Placement Platform

## Instant Setup (3 Steps)

### 1️⃣ Start Services
```powershell
# Open 3 terminals and run:

# Terminal 1
cd frontend && npm run dev

# Terminal 2
cd backend && npm run dev

# Terminal 3
cd ai-services && python -m uvicorn gateway:app --host 0.0.0.0 --port 8000
```

### 2️⃣ Seed Sample Data (Optional)
```powershell
cd backend
npx ts-node src/scripts/seedResources.ts
```

### 3️⃣ Access Application
- **Frontend**: http://localhost:5173 (or 5174, 5175 if 5173 is in use)
- **Backend API**: http://localhost:5000/api
- **AI Gateway**: http://localhost:8000/docs

**Quick links (after login):** Use your frontend URL (e.g. http://localhost:5173)
- Dashboard: `/dashboard`
- Job Intel: `/job-recommendations` · Saved: `/saved-jobs` · Prep Tips: `/prep-tips`
- Goals: `/goals` · Interview Q&A: `/interview-qa` · Insights Hub: `/insights`
- Press **⌘K** (Mac) or **Ctrl+K** (Windows) for the command menu to jump to any page.

---

## 📱 Test Accounts

### Student Account:
```
Email: student@test.com
Password: password123
```

### Recruiter Account:
```
Email: recruiter@test.com
Password: password123
```

---

## 🎯 Key Features to Test

### As a Student:
1. **Dashboard** → View AI job recommendations
2. **Jobs** → Browse and apply to positions
3. **Applications** → Track your application status (Kanban view)
4. **Roadmap** → See your AI-generated career path
5. **Settings** → Update CGPA, skills, year
6. **Resume** → Upload and get AI parsing
7. **Insights Hub** → Skill matrix, prep calendar, weekly focus (Advanced)
8. **Saved Jobs** → View and manage jobs saved from Job Intel (persisted in browser)
9. **Prep Tips** → Interview, resume, and placement day tips (quick reference)
10. **Goals & Milestones** → Set application/saved-job targets and track progress
11. **Interview Q&A Bank** → Common interview questions and answer tips
12. **Activity streak** → Shown on Dashboard (consecutive days of visiting)
13. **Profile completeness** → Shown on My Profile (percentage and checklist)

### As a Recruiter:
1. **Dashboard** → View hiring funnel analytics
2. **Post Job** → Create new job listings
3. **My Jobs** → Manage your postings (real applicant counts!)
4. **Applicants** → Review and update candidate status
5. **Analytics** → Track recruitment performance

### As Admin:
1. **Analytics Hub** → Placement trends and metrics
2. **Resources** → Browse learning materials (12 seeded!)
3. **Students** → View all registered students
4. **Jobs** → Monitor all active listings

---

## 🔥 What's NEW Today

**Insights Hub (5 files updated for review):** `Router.tsx`, `CommandMenu.tsx`, `StudentLayout.tsx`, `InsightsHub.tsx`, `README.md`

✅ **Saved Jobs** - Save jobs from Job Intel; view and manage in one place (browser storage)  
✅ **Prep Tips** - Interview, resume, and placement day tips (collapsible sections)  
✅ **Goals & Milestones** - Set targets for applications and saved jobs; track progress with bars  
✅ **Interview Q&A Bank** - Common interview questions with answer guidelines  
✅ **Activity streak** - Consecutive-day counter on student dashboard  
✅ **Profile completeness** - Checklist and % on My Profile  
✅ **Insights Hub** - Next-level prep: skill matrix, prep calendar, weekly focus  
✅ **MyJobs Dashboard** - Real applicant counts via MongoDB aggregation  
✅ **Analytics Dashboard** - Live backend integration  
✅ **Resources Module** - Complete backend + 12 sample resources  
✅ **Service Layer** - Clean API abstractions everywhere

---

## 📚 Documentation

- `INTEGRATION_SUMMARY.md` - Complete technical overview
- `API_REFERENCE.md` - All endpoints with examples
- `ENHANCEMENTS_PROGRESS.md` - Development timeline
- `FINAL_STATUS_REPORT.md` - Comprehensive status
- `README.md` (this file) - Quick start

---

## 🛠️ Troubleshooting

### Port Already in Use?
```powershell
# Find and kill process
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### MongoDB Connection Failed?
- Check `.env` file has valid `MONGO_URI`
- Verify MongoDB Atlas cluster is running
- Whitelist your IP address

### AI Gateway Not Responding?
```powershell
# Navigate to ai-services
cd ai-services
pip install -r requirements.txt
python -m uvicorn gateway:app --reload
```

---

## 🚢 Deployment Checklist

Before going to production:

- [ ] Change JWT secrets in `.env`
- [ ] Update MongoDB to production cluster
- [ ] Set `NODE_ENV=production`
- [ ] Build frontend: `npm run build`
- [ ] Configure CORS for production domain
- [ ] Set up environment variables on hosting
- [ ] Enable rate limiting on API
- [ ] Set up SSL certificates (HTTPS)
- [ ] Configure CDN for static assets
- [ ] Set up monitoring (e.g., Sentry, LogRocket)

---

## 📞 Need Help?

Check the comprehensive documentation files for detailed information on:
- Architecture
- API endpoints
- Database schemas
- Service methods
- Deployment strategies

**Happy Coding! 🎉**
