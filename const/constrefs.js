const __DEBUG__ = process.env.NODE_ENV === 'production' ? false : true;

const WHITELIST_FOR_CORS = [
  'https://www.yoursite.com',
  'http://127.0.0.1:5500',
  'http://localhost:3500',
];

module.exports = { __DEBUG__, WHITELIST_FOR_CORS }
