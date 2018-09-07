const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const autopopulate = require("mongoose-autopopulate");

const cardSchema = new Schema({
  companyName: {
    type: String
  },
  postingURL: {
    type: String
  },
  board: {
    type: mongoose.Schema.ObjectId,
    ref: "board",
    autopopulate: {
      maxDepth: 1
    }
  }
});

const Card = mongoose.model("card", cardSchema);

const boardSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "user",
    autopopulate: {
      maxDepth: 1
    }
  },
  cards: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "card",
      autopopulate: {
        maxDepth: 1
      }
    }
  ]
}).plugin(autopopulate);

let Board = mongoose.model("board", boardSchema);

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

let User = mongoose.model("user", userSchema);

module.exports = { User, Board, Card };
