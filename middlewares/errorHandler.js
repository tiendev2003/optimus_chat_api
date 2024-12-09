const formatResponse = require('../utils/responseFormatter');

const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json(formatResponse(err.message || 'An error occurred', 'error', null));
};

module.exports = errorHandler;