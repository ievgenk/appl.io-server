let express = require("express");
let path = require("path");
let cookieParser = require("cookie-parser");
let logger = require("morgan");
const cors = require("cors");

let indexRouter = require("./routes/index");
let usersRouter = require("./routes/users");
let apiRouter = require("./routes/api");

let app = express();

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/api", apiRouter);

module.exports = app;
