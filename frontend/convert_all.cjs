const fs = require('fs');
const path = require('path');

const projectDir = 'c:/Users/ADMIN/Desktop/ai_application/placement application/frontend/src';

function walkDir(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walkDir(fullPath));
    } else {
      if (fullPath.endsWith('.tsx') || fullPath.endsWith('.jsx')) {
        results.push(fullPath);
      }
    }
  });
  return results;
}

const files = walkDir(projectDir);
let changedCount = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  const initialContent = content;

  // Background conversions
  content = content.replace(/bg-\[#0A0D1E\]/g, 'bg-white');
  content = content.replace(/bg-\[#05070A\]/g, 'bg-white');
  content = content.replace(/glass-premium/g, 'bg-white border border-slate-100');
  content = content.replace(/bg-apple-gray-900/g, 'bg-white');
  
  // Specific dark colors
  content = content.replace(/text-white/g, 'text-slate-900');
  
  // We should be careful with colors, but they want it all changed
  content = content.replace(/text-emerald-400/g, 'text-emerald-600');
  content = content.replace(/text-teal-400/g, 'text-teal-600');
  content = content.replace(/text-cyan-400/g, 'text-cyan-600');
  content = content.replace(/text-amber-400/g, 'text-amber-600');
  content = content.replace(/text-rose-400/g, 'text-rose-600');
  content = content.replace(/text-blue-400/g, 'text-blue-600');
  content = content.replace(/text-indigo-400/g, 'text-indigo-600');
  content = content.replace(/text-slate-300/g, 'text-slate-500');
  content = content.replace(/text-slate-400/g, 'text-slate-500');
  
  // Inner boxes in dark mode
  content = content.replace(/bg-white\/5/g, 'bg-slate-50');
  content = content.replace(/bg-white\/10/g, 'bg-slate-100');
  content = content.replace(/bg-white\/20/g, 'bg-slate-200');
  content = content.replace(/border-white\/5/g, 'border-slate-100');
  content = content.replace(/border-white\/10/g, 'border-slate-200');
  content = content.replace(/border-white\/20/g, 'border-slate-200');
  
  // Shadows
  content = content.replace(/shadow-3xl/g, 'shadow-md shadow-slate-200/40');
  
  // Restore specific text-whites where they make sense (like colored backgrounds)
  content = content.replace(/bg-emerald-500 text-slate-900/g, 'bg-emerald-500 text-white');
  content = content.replace(/bg-emerald-600 text-slate-900/g, 'bg-emerald-600 text-white');
  content = content.replace(/bg-rose-500 text-slate-900/g, 'bg-rose-500 text-white');
  content = content.replace(/bg-rose-600 text-slate-900/g, 'bg-rose-600 text-white');
  content = content.replace(/bg-blue-500 text-slate-900/g, 'bg-blue-500 text-white');
  content = content.replace(/bg-blue-600 text-slate-900/g, 'bg-blue-600 text-white');
  content = content.replace(/bg-violet-500 text-slate-900/g, 'bg-violet-500 text-white');
  content = content.replace(/bg-violet-600 text-slate-900/g, 'bg-violet-600 text-white');
  content = content.replace(/bg-indigo-500 text-slate-900/g, 'bg-indigo-500 text-white');
  content = content.replace(/bg-indigo-600 text-slate-900/g, 'bg-indigo-600 text-white');

  // Gradient text
  content = content.replace(/text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-teal-400/g, 'text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-cyan-600 to-teal-600');

  if (content !== initialContent) {
    fs.writeFileSync(file, content, 'utf8');
    changedCount++;
  }
});

console.log('Modified ' + changedCount + ' files.');
