//IMPORTS
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");

const indexRouter = require("./routes");
const usersRouter = require("./routes/users");
const apiRouter = require("./routes/api");

const app = express();

//ENV VARIABLES SETUPS
require("dotenv").config();
const { PORT, MONGODB_URI } = process.env;

//MONGO CONNECTION

mongoose
  .connect(
    MONGODB_URI,
    { useNewUrlParser: true }
  )
  .then(() => {
    console.log("Sucesfully connected to local DB");
  })
  .catch(err => {
    throw err;
  });

//MIDDLEWARE

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//ROUTING

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/api", apiRouter);

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});

module.exports = app;
