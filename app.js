const express = require("express");
const path = require("path");
const favicon = require("serve-favicon");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

//load model
require("./models/GreenHouse_Sensor");
require("./models/Project_Sensor");
require("./models/GreenHouse");
require("./models/farm");
require("./models/know_controller");

//load routes
const sensorRoutes = require("./routes/sensorRoutes");
const index = require("./routes/index");
const users = require("./routes/users");
const greenHouseRoutes = require("./routes/greenHouseRoutes");
const temperatureControl = require("./routes/temperatureControl");

//load keys
const keys = require("./config/keys");

//map global promise
mongoose.promise = global.promise;

//Mongoose connect
mongoose.Promise = global.Promise;
mongoose
  .connect(keys.mongoURI)
  .then(console.log("MongoDb Connected"))
  .catch(err => {
    if (err) {
      return handleError(err);
    }
  });

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//use Routes
app.use("/", index);
app.use("/users", users);
app.use("/sensorRoutes", sensorRoutes);
app.use("/greenHouse", greenHouseRoutes);
app.use("/temperatureControl", temperatureControl);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

app.listen(80);

module.exports = app;
