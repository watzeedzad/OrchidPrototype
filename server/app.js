const express = require("express");
const path = require("path");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const memoryStore = require("memorystore")(session);
const cors = require("cors");
const cron = require("node-schedule")
const ipfilter = require("express-ipfilter").IpFilter;
require("dotenv").config();

var ips = ["127.0.0.1", "::1", "192.168.1.12", "192.168.1.15", "192.168.1.107"];
temperatureCheckStatus = 0;
soilMoistureCheckStatus = 0;
fertilityCheckStatus = 0;
origin_url = process.env.ORIGIN_URL;
db_host = process.env.DB_HOST;
db_user = process.env.DB_USER;
db_pass = process.env.DB_PASS;
aes256_key = process.env.AES256_KEY

//load babel(es6)
require("babel-core/register");
require("babel-polyfill");

//load keys
const keys = require("./config/keys");

//map global promise
mongoose.promise = global.promise;

//Mongoose connect
mongoose.Promise = global.Promise;
let connection = mongoose
  .connect(keys.mongoURI, {
    useNewUrlParser: true
  })
  .then(console.log("MongoDb Connected"))
  .catch(err => {
    if (err) {
      return console.error(err);
    }
  });

//load model
require("./models/GreenHouse_Sensor");
require("./models/Project_Sensor");
require("./models/GreenHouse");
require("./models/farm");
require("./models/know_controller");
require("./models/user");
require("./models/fertilizer_history");
require("./models/water_history");
require("./models/growth_rate");
require("./models/Project");
require("./models/relay_queue");
require("./models/relayManualQueue");
require("./models/light_duration");
require("./models/tempWateringHistory");
require("./models/tempFertilizeringHistory");


//load routes
const sensorRoutes = require("./routes/sensorRoutes");
const greenHouseRoutes = require("./routes/greenHouseRoutes");
const temperatureControl = require("./routes/temperatureControl");
const planterAnalyze = require("./routes/planterAnalyze");
const login = require("./routes/login");
const logout = require("./routes/logout");
const waterControl = require("./routes/waterControl");
const fertilizerControl = require("./routes/fertilizerControl");
const controllerManagement = require("./routes/controllerManagement");
const monitoringAndAnalyze = require("./routes/monitoringAndAnalyze");
const lightControl = require("./routes/lightControl");
const dynamicControllerHandle = require("./routes/dynamicControllerHandle");
const user = require("./routes/user");
const utils = require("./routes/utils");
const projectRoutes = require("./routes/projectRoutes");
const farm = require('./routes/farm');

const app = express();

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());
app.use(session({
  secret: 'a4f8071f-c873-4447-8ee2',
  cookie: {
    maxAge: 2628000000
  },
  store: new memoryStore({
    checkPeriod: 86400000
  }),
  resave: true,
  saveUninitialized: false
}));
app.use(cors({
  origin: [origin_url],
  methods: ["GET", "POST"],
  credentials: true
}));
app.use(express.static(path.join(__dirname, "public")));
app.use(ipfilter(ips, {
  mode: "allow"
}));

//use Routes
app.use("/sensorRoutes", sensorRoutes);
app.use("/greenHouse", greenHouseRoutes);
app.use("/temperatureControl", temperatureControl);
app.use("/planterAnalyze", planterAnalyze);
app.use("/login", login);
app.use("/waterControl", waterControl);
app.use("/fertilizerControl", fertilizerControl);
app.use("/controllerManagement", controllerManagement);
app.use("/monitoringAndAnalyze", monitoringAndAnalyze);
app.use("/lightControl", lightControl);
app.use("/dynamicControllerHandle", dynamicControllerHandle);
app.use("/user", user);
app.use("/utils", utils);
app.use("/project", projectRoutes);
app.use("/farm", farm);
app.use("/logout", logout);

let SummaryAutoFertilizeringHistory = require("./classes/Utils/SummaryAutoFertilizeringHistory");
let SummaryAutoWateringHistory = require("./classes/Utils/SummaryAutoWateringHistory");

let cronSchedule = cron.scheduleJob("0 22 * * *", function () {
  new SummaryAutoWateringHistory.default();
  new SummaryAutoFertilizeringHistory.default();
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send("404: File Not Found");
});

module.exports = app;