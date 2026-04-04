const fs = require('fs');

const filesToUpdate = [
  'c:/Users/ADMIN/Desktop/ai_application/placement application/frontend/src/layouts/AdminLayout.tsx',
  'c:/Users/ADMIN/Desktop/ai_application/placement application/frontend/src/pages/Admin/AdminDashboard.tsx',
  'c:/Users/ADMIN/Desktop/ai_application/placement application/frontend/src/features/auth/Login.tsx',
  'c:/Users/ADMIN/Desktop/ai_application/placement application/frontend/src/features/auth/AdminLogin.tsx',
];

filesToUpdate.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/Placement Staff Portal/g, 'Placement Officer Portal');
    content = content.replace(/Placement Staff Center/g, 'Placement Officer Center');
    content = content.replace(/Placement Staff Hub/g, 'Placement Officer Hub');
    content = content.replace(/Placement Staff Access/g, 'Placement Officer Access');
    content = content.replace(/Placement Staff Dashboard/g, 'Placement Officer Dashboard');
    content = content.replace(/Placement Staff/g, 'Placement Officer');
    fs.writeFileSync(file, content, 'utf8');
  }
});

console.log('Admin portals rebranded to Placement Officer');
