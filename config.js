module.exports.PORT = process.env.PORT || 1234;
module.exports.MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/appl-io";
module.exports.JWT_SECRET = process.env.JWT_SECRET || "wolf_howl";
