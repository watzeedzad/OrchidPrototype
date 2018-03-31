var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

var router = express.Router();

var uri = "mongodb://HelloUser:123456@13.229.224.156:27017/OrchidPrototype";

var app = express();
router.use(bodyParser.json());

mongoose.connect(uri);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

var Schema = mongoose.Schema;

var greenhouse_sensor_schema = new Schema({
  greenhouseSensorId: Number,
  temperature: Number,
  humidity: Number,
  soilmoisture: Number,
  ambientLight: Number,
  timeStamp: Date,
  greenhouseId: Number
});




router.post("/", function (request, respond) {
  console.log(request.body);
  var temperature = request.body.temperature;
  var humidity = request.body.humidity;
  var fertility = request.body.fertility;
  var moisture = request.body.moisture;
  console.log(temperature);
  console.log(humidity);
  console.log(fertility);
  console.log(moisture);
  addSensorData(request, respond);
});

router.get("/", function (request, respond) {
  SensorDataModel.find(function (err, sensorDataList) {
    if (!err) {
      respond.json(sensorDataList);
    } else {
      respond.json({});
    }
  });
});

module.exports = router;