const os = require('os');
const fs = require('fs');
const path = require('path');

function getLocalIpAddress() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return '192.168.1.1'; // Fallback IP
}

const ipAddress = getLocalIpAddress();
const configPath = path.join(__dirname, '..', 'app.config.js');

let configContent = fs.readFileSync(configPath, 'utf8');
configContent = configContent.replace(
  /apiUrl: process\.env\.API_URL \|\| "http:\/\/[^"]+"/,
  `apiUrl: process.env.API_URL || "http://${ipAddress}:5000"`
);

fs.writeFileSync(configPath, configContent);
console.log(`Updated API URL to: http://${ipAddress}:5000`); 