const fs = require('fs');

const recruiterLayout = 'c:/Users/ADMIN/Desktop/ai_application/placement application/frontend/src/layouts/RecruiterLayout.tsx';
if (fs.existsSync(recruiterLayout)) {
  let content = fs.readFileSync(recruiterLayout, 'utf8');
  content = content.replace(/Staff Portal/g, 'Mentor Portal');
  content = content.replace(/Staff Dashboard/g, 'Mentor Dashboard');
  content = content.replace(/Staff Desk/g, 'Mentor Desk');
  content = content.replace(/Staff/g, 'Mentor');
  fs.writeFileSync(recruiterLayout, content, 'utf8');
}

const recruiterDashboard = 'c:/Users/ADMIN/Desktop/ai_application/placement application/frontend/src/pages/Dashboard/RecruiterDashboard.tsx';
if (fs.existsSync(recruiterDashboard)) {
  let content = fs.readFileSync(recruiterDashboard, 'utf8');
  content = content.replace(/Staff Command Center/g, 'Mentor Command Center');
  content = content.replace(/Staff Analytics Report/g, 'Mentor Analytics Report');
  content = content.replace(/Verified Staff Officer/g, 'Verified Mentor');
  content = content.replace(/Staff Dashboard/g, 'Mentor Dashboard');
  content = content.replace(/Staff/g, 'Mentor');
  fs.writeFileSync(recruiterDashboard, content, 'utf8');
}

const adminLayout = 'c:/Users/ADMIN/Desktop/ai_application/placement application/frontend/src/layouts/AdminLayout.tsx';
if (fs.existsSync(adminLayout)) {
  let content = fs.readFileSync(adminLayout, 'utf8');
  content = content.replace(/Placement Dashboard/g, 'Placement Staff Dashboard');
  content = content.replace(/Office Hub/g, 'Placement Staff Hub');
  content = content.replace(/Placement Office/g, 'Placement Staff Portal');
  fs.writeFileSync(adminLayout, content, 'utf8');
}

const adminDashboard = 'c:/Users/ADMIN/Desktop/ai_application/placement application/frontend/src/pages/Admin/AdminDashboard.tsx';
if (fs.existsSync(adminDashboard)) {
  let content = fs.readFileSync(adminDashboard, 'utf8');
  content = content.replace(/Global Operations Center/g, 'Placement Staff Center');
  content = content.replace(/CONTROL CENTER/g, 'STAFF CENTER');
  fs.writeFileSync(adminDashboard, content, 'utf8');
}

console.log('Portals separated into Mentor and Placement Staff');
