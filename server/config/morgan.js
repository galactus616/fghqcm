const morgan = require('morgan');
const path = require('path');
const fs = require('fs');

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Create a write stream for access logs
const accessLogStream = fs.createWriteStream(
  path.join(logsDir, 'access.log'),
  { flags: 'a' }
);

// Morgan configuration for development
const morganDev = morgan('dev');

// Morgan configuration for production
const morganProd = morgan('combined', { stream: accessLogStream });

// Custom morgan format for better logging
const morganCustom = morgan((tokens, req, res) => {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'),
    '-',
    tokens['response-time'](req, res),
    'ms',
    '-',
    tokens['user-agent'](req, res),
    '-',
    req.ip || req.connection.remoteAddress
  ].join(' ');
}, { stream: accessLogStream });

// Export based on environment
const getMorganConfig = () => {
  const env = process.env.NODE_ENV || 'development';
  
  if (env === 'development') {
    return morganDev;
  } else {
    return morganCustom;
  }
};

module.exports = {
  morganDev,
  morganProd,
  morganCustom,
  getMorganConfig,
  accessLogStream
}; 