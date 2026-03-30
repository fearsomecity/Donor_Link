const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function fixHoversInFile(filePath) {
  try {
    const code = fs.readFileSync(filePath, 'utf8');
    let newCode = code;

    // For components containing stark white hover backgrounds, swap with dark borders
    // This affects list items in HospitalInventory, DonorEligibility, etc.
    newCode = newCode.replace(/hover:bg-white/g, 'hover:border-neutral-900 dark:hover:border-white');
    // For dark mode, sometimes they added hover bg we want to remove
    newCode = newCode.replace(/dark:hover:bg-\[\#[0-9a-fA-F]+\]/g, 'dark:hover:border-white');

    // For explicit buttons the user mentioned (e.g. .btn-primary) which is only in index.css
    if (filePath.endsWith('index.css')) {
      newCode = newCode.replace(
        /hover:bg-crimson-700/g,
        'border border-transparent hover:border-white hover:bg-crimson-600'
      );
    }

    if (code !== newCode) {
      fs.writeFileSync(filePath, newCode, 'utf8');
      console.log(`Updated hover effects in ${filePath}`);
    }
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err.message);
  }
}

function traverse(dir) {
  try {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      if (fs.statSync(fullPath).isDirectory()) {
        traverse(fullPath);
      } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.css') || fullPath.endsWith('.js')) {
        fixHoversInFile(fullPath);
      }
    }
  } catch(e) {
    console.error(`Error traversing ${dir}:`, e.message);
  }
}

traverse(srcDir);
console.log("Finished fixing hover states.");
