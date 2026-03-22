const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const logPath = path.join(__dirname, 'backend.log');
const logStream = fs.createWriteStream(logPath, { flags: 'a' });

console.log(`Starting backend with logs to ${logPath}`);

const proc = spawn('npm', ['start'], {
  cwd: path.join(__dirname, 'backend'),
  shell: true,
  stdio: ['ignore', 'pipe', 'pipe']
});

proc.stdout.pipe(logStream);
proc.stderr.pipe(logStream);

proc.on('close', (code) => {
  console.log(`Process exited with code ${code}`);
});

process.on('SIGINT', () => proc.kill());
process.on('SIGTERM', () => proc.kill());
