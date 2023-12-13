// external imports
const express = require("express");
const http = require("http");
const path = require("path");
const cookieParser = require("cookie-parser");
const moment = require("moment");
const cors = require("cors");
// internal imports
const loginRouter = require("./routers/loginRouter");
const usersRouter = require("./routers/usersRouter");
const inboxRouter = require("./routers/inboxRouter");

const {
  notFoundErrorHandler,
  defaultErrorHandler,
} = require("./middlewares/common/errorHandler");
// express app
const app = express();
app.use(cors());

// initialize socket.io
const server = http.createServer(app);
const io = require("socket.io")(server);
global.io = io;

// set moment to loacal for message time
app.locals.moment = moment;

// request parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// set template engine
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

// set static directiory
app.use(express.static(path.join(__dirname, "./public")));

// cookie parser
app.use(cookieParser(process.env.COOKIE_SECRET));

// login router
app.use("/", loginRouter);
// users router
app.use("/users", usersRouter);
// inbox router
app.use("/inbox", inboxRouter);

// 404/ not found error handling
app.use(notFoundErrorHandler);

// default error handling
app.use(defaultErrorHandler);

module.exports = server;
