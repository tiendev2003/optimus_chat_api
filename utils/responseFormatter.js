
const formatResponse = (message, status, data) => {
  return {
    message,
    status,
    data
  };
};

module.exports = formatResponse;