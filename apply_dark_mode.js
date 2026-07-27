const fs = require('fs');
const path = require('path');

const replacements = {
  'bg-slate-50': 'bg-slate-50 dark:bg-slate-950 transition-colors',
  'bg-white': 'bg-white dark:bg-slate-900 transition-colors',
  'text-slate-900': 'text-slate-900 dark:text-white',
  'text-slate-800': 'text-slate-800 dark:text-slate-100',
  'text-slate-700': 'text-slate-700 dark:text-slate-300',
  'text-slate-600': 'text-slate-600 dark:text-slate-400',
  'text-slate-500': 'text-slate-500 dark:text-slate-400',
  'border-slate-100': 'border-slate-100 dark:border-slate-800',
  'border-slate-200': 'border-slate-200 dark:border-slate-800',
  'border-slate-300': 'border-slate-300 dark:border-slate-700',
  'bg-slate-100': 'bg-slate-100 dark:bg-slate-800 transition-colors',
  'bg-slate-200': 'bg-slate-200 dark:bg-slate-800 transition-colors',
};

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // We only replace exact words inside quotes for className to avoid replacing already applied dark: classes
  // A simple regex approach that splits by class names
  for (const [key, value] of Object.entries(replacements)) {
    // Look for key that is not preceded by 'dark:' and not already followed by the replacement
    // Easiest is to replace 'key ' or 'key"' and ensure we don't duplicate.
    const regex = new RegExp(`(?<!dark:)\\b${key}\\b(?! dark:)`, 'g');
    content = content.replace(regex, value);
  }
  
  // Deduplicate classes if accidentally added multiple times
  content = content.replace(/dark:bg-slate-950 transition-colors transition-colors/g, 'dark:bg-slate-950 transition-colors');
  content = content.replace(/dark:bg-slate-900 transition-colors transition-colors/g, 'dark:bg-slate-900 transition-colors');

  if (content !== original) {
    fs.writeFileSync(filePath, content);
    console.log('Updated:', filePath);
  }
}

function traverse(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      traverse(fullPath);
    } else if (fullPath.endsWith('page.tsx')) {
      processFile(fullPath);
    }
  }
}

traverse(path.join(__dirname, 'src/app'));
console.log('Done applying dark mode.');
