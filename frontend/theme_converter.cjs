const fs = require('fs');

const files = [
  'c:/Users/ADMIN/Desktop/ai_application/placement application/frontend/src/pages/Dashboard/StudentDashboard.tsx',
  'c:/Users/ADMIN/Desktop/ai_application/placement application/frontend/src/pages/Dashboard/RecruiterDashboard.tsx',
  'c:/Users/ADMIN/Desktop/ai_application/placement application/frontend/src/pages/Admin/SuperAdminDashboard.tsx'
];

files.forEach(file => {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');

  // Convert dark theme colors to light theme colors for cards
  content = content.replace(/bg-\[#0A0D1E\]/g, 'bg-white');
  content = content.replace(/bg-\[#05070A\]/g, 'bg-white');
  content = content.replace(/glass-premium/g, 'bg-white');
  
  // Text colors
  content = content.replace(/text-white/g, 'text-slate-900');
  content = content.replace(/text-emerald-400/g, 'text-emerald-600');
  content = content.replace(/text-teal-400/g, 'text-teal-600');
  content = content.replace(/text-cyan-400/g, 'text-cyan-600');
  content = content.replace(/text-amber-400/g, 'text-amber-600');
  content = content.replace(/text-rose-400/g, 'text-rose-600');
  content = content.replace(/text-blue-400/g, 'text-blue-600');
  content = content.replace(/text-indigo-400/g, 'text-indigo-600');
  
  // Backgrounds inside cards
  content = content.replace(/bg-white\/5/g, 'bg-slate-50 border border-slate-100');
  content = content.replace(/bg-white\/10/g, 'bg-slate-100');
  content = content.replace(/bg-white\/20/g, 'bg-slate-200');
  content = content.replace(/border-white\/5/g, 'border-slate-100');
  content = content.replace(/border-white\/10/g, 'border-slate-200');
  content = content.replace(/border-white\/20/g, 'border-slate-200');
  
  // Box shadows
  content = content.replace(/shadow-3xl/g, 'shadow-md shadow-slate-200/40');
  
  // Restore text-white for buttons and specific things
  content = content.replace(/bg-emerald-600 text-slate-900/g, 'bg-emerald-600 text-white');
  content = content.replace(/bg-gradient-to-r from-emerald-600 to-teal-700 text-slate-900/g, 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white');
  content = content.replace(/text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-teal-400/g, 'text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-cyan-600 to-teal-600');

  // Change generic dashboards to white/pink styling for banners if they match dark banners
  content = content.replace(/bg-gradient-to-br from-indigo-900 via-slate-900 to-black/g, 'bg-gradient-to-br from-violet-600 via-fuchsia-600 to-rose-500');
  
  fs.writeFileSync(file, content, 'utf8');
});

console.log('Remaining dashboard theme conversions applied.');
