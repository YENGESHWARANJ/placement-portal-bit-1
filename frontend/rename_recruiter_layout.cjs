const fs = require('fs');

const file = 'c:/Users/ADMIN/Desktop/ai_application/placement application/frontend/src/layouts/RecruiterLayout.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/Recruiter Portal/g, 'Staff Portal');
content = content.replace(/Recruiter Area/g, 'Staff Area');
content = content.replace(/Recruiter/g, 'Staff');

fs.writeFileSync(file, content, 'utf8');
console.log('Recruiter layout text updated to Staff');
