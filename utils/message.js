const genereateMessage = (username, text) => {
  return {
    username,
    text,
    // createdAt:new Date().toLocaleTimeString()
    createdAt: new Date().getTime(),
  };
};

const generateLocationMessage = (username, location) => {
  return {
    username,
    location,
    createdAt: new Date().getTime(),
  };
};

module.exports = {
  genereateMessage,
  generateLocationMessage,
};
