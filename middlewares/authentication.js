const jwt = require('jsonwebtoken');
const formatResponse = require('../utils/responseFormatter');
const dotenv = require('dotenv');
dotenv.config();

const JWT_TOKEN = process.env.JWT_TOKEN;
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json(formatResponse('No token provided', 'error'));
  }

  const token = authHeader.split(' ')[1];
  
  jwt.verify(token, JWT_TOKEN, (err, user) => {
    if (err) {
      return res.status(403).json(formatResponse('Invalid token', 'error'));
    }
    req.user = user;
    next();
  });
};

module.exports = authenticateToken;
