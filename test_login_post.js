const http = require('http');

const data = JSON.stringify({
  email: 'aditya@gmail.com',
  password: 'somepassword'
});

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  },
  timeout: 5000
};

console.log('Sending POST to http://localhost:5000/api/auth/login...');

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  res.on('data', (d) => {
    process.stdout.write(d);
  });
});

req.on('error', (error) => {
  console.error('Error:', error.message);
});

req.on('timeout', () => {
  console.error('Timed out!');
  req.destroy();
});

req.write(data);
req.end();
