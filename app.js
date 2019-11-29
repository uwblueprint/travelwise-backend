const createError = require("http-errors");
const express = require("express");
const session = require("express-session");
const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const lessMiddleware = require("less-middleware");
const logger = require("morgan");

const dotenv = require("dotenv");
dotenv.config();

const routes = require("./routes");
const graphqlServer = require("./graphql/server");

const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200
};

const app = express();

// Initialize sessions.
const SESSION_SECRET = process.env.SESSION_SECRET;
if (!SESSION_SECRET) throw new Error("Missing environnment variable 'SESSION_SECRET'");

app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 3600 * 1000
    }
  })
);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(lessMiddleware(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "public")));
app.use(cors(corsOptions));

app.use("/", routes);

graphqlServer.applyMiddleware({ app });

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404, "Not found."));
});

// error handler
app.use(function(err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
