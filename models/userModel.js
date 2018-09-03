const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    min: 5,
    max: 20,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    min: 5,
    max: 16
  }
});

let UserModel = mongoose.model("user", userSchema);

module.exports = UserModel;
