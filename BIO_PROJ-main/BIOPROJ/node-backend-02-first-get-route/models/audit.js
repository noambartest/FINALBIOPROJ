const fs = require('fs');
const path = require('path');

const logFilePath = path.join(__dirname, 'audit.log');

const logActivity = (message) => {
  const timestamp = new Date().toISOString();
  const logMessage = `${timestamp} - ${message}\n`;
  fs.appendFile(logFilePath, logMessage, (err) => {
    if (err) {
      console.error('Failed to write to log file', err);
    }
  });
};

module.exports = logActivity;