const fs = require('fs');

const files = [
  'c:/Users/ADMIN/Desktop/ai_application/placement application/frontend/src/pages/Admin/AdminDashboard.tsx',
  'c:/Users/ADMIN/Desktop/ai_application/placement application/frontend/src/pages/AnalyticsDashboard.tsx'
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
  content = content.replace(/bg-white\/5/g, 'bg-slate-50');
  content = content.replace(/bg-white\/10/g, 'bg-slate-100');
  content = content.replace(/bg-white\/20/g, 'bg-slate-200');
  content = content.replace(/border-white\/5/g, 'border-slate-100');
  content = content.replace(/border-white\/10/g, 'border-slate-200');
  content = content.replace(/border-white\/20/g, 'border-slate-200');
  
  // Box shadows
  content = content.replace(/shadow-3xl/g, 'shadow-xl shadow-slate-200/40');
  
  // Restore text-white for buttons and specific things
  content = content.replace(/bg-emerald-600 text-slate-900/g, 'bg-emerald-600 text-white');
  content = content.replace(/bg-gradient-to-r from-emerald-600 to-teal-700 text-slate-900/g, 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white');
  content = content.replace(/text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-teal-400/g, 'text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-cyan-600 to-teal-600');

  // Specific Admin banner change
  // Let's make the top banner match the screenshot style: bright gradient
  content = content.replace(/bg-white rounded-\[30px\] sm:rounded-\[60px\] p-6 sm:p-10 md:p-16 text-slate-900 shadow-\[0_40px_100px_rgba\(0,0,0,0\.5\)\] group border border-slate-100 mx-2 sm:mx-0/, 'bg-gradient-to-r from-violet-600 to-purple-700 rounded-[30px] sm:rounded-[60px] p-6 sm:p-10 md:p-16 text-white shadow-2xl group border-0 mx-2 sm:mx-0');
  
  fs.writeFileSync(file, content, 'utf8');
});

console.log('Theme conversion applied.');
