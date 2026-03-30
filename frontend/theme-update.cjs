const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function replaceInFile(filePath) {
  try {
    const code = fs.readFileSync(filePath, 'utf8');
    let newCode = code
      .replace(/\[#000000\]/g, '[#0a0a0a]')
      .replace(/\[#000\]/g, '[#0a0a0a]')
      .replace(/\[#111111\]/g, '[#141414]')
      .replace(/\[#111\]/g, '[#141414]')
      .replace(/\[#050505\]/g, '[#141414]')
      .replace(/\[#1a1a1a\]/g, '[#141414]')
      .replace(/\[#222222\]/g, '[#2a2a2a]')
      .replace(/\[#222\]/g, '[#2a2a2a]')
      .replace(/shadow-\[#111\]/g, 'shadow-[#0a0a0a]');
      
    if (code !== newCode) {
      fs.writeFileSync(filePath, newCode, 'utf8');
      console.log(`Updated ${filePath}`);
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
        replaceInFile(fullPath);
      }
    }
  } catch(e) {
    console.error(`Error traversing ${dir}:`, e.message);
  }
}

traverse(srcDir);
console.log("Finished replacing theme colors.");
