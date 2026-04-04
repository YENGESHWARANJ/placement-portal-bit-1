const fs = require('fs');

const file = 'c:/Users/ADMIN/Desktop/ai_application/placement application/frontend/src/pages/Dashboard/RecruiterDashboard.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace specific UI strings
content = content.replace(/Recruitment Command Center/g, 'Staff Command Center');
content = content.replace(/Recruitment Funnel/g, 'Student Placements Funnel');
content = content.replace(/Recruiter Analytics Report/g, 'Staff Analytics Report');
content = content.replace(/Verified Recruiter/g, 'Verified Staff Officer');
content = content.replace(/Recruiter/g, 'Staff'); // General sweep for things like "RecruiterDashboard" (function name doesn't matter much visually but fine)
content = content.replace(/recruiter-report-/g, 'staff-report-');

fs.writeFileSync(file, content, 'utf8');
console.log('RecruiterDashboard text updated to StaffDashboard');
