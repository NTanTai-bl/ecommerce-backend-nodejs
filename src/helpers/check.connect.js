const mongoose = require("mongoose");
const countConnect = () => {
  const numConnection = mongoose.connect.length;
  console.log(`Number of connection: ${numConnection}`);
};

module.exports = {
  countConnect,
};
