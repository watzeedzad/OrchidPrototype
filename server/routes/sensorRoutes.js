const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const greenHouseSensor = mongoose.model("greenHouse_Sensor");
const projectSensor = mongoose.model("project_Sensor");
const know_controller = mongoose.model("know_controller");
import TemperatureCheck from "../classes/TemperatureCheck";

let controllerData;

async function getControllerData(ip) {
  console.log("enter 0");
  let controllerResult = await know_controller.findOne({
    ip: ip
  }, function(err, result) {
    if (err) {
      console.log("Query fail!");
    } else {
      controllerData = result;
      console.log("Result enter 0: " + controllerData);
    }
  });
}

async function saveSensorData(greenHouseId, temp, humid, soilMoisture, ambientLight) {
  const newGreenHouseData = {
    greenHouseSensorId: 1,
    temperature: temp,
    humidity: humid,
    soilMoisture: soilMoisture,
    ambientLight: ambientLight,
    timeStamp: Date.now(),
    greenHouseId: greenHouseId
  };

  new greenHouseSensor(newGreenHouseData).save(function (err) {
    if (!err) {
      console.log("created green house!");
    } else {
      //TODO: return page with errors
      return console.log(err);
    }
  });
}

router.use("/greenHouseSensor", (req, res, next) => {
  async function getData() {
    let ip = req.body.ip
    console.log("ip: " + req.body.ip)
    await getControllerData(ip);
    next()
  }
  getData();
})

//Add greenHouseSensor
router.post("/greenHouseSensor", (req, res) => {
  console.log(controllerData.greenHouseId);
  let greenHouseId = controllerData.greenHouseId;
  let temp = req.body.temperature;
  let humid = req.body.humidity;
  let soilMoisture = req.body.soilMoisture;
  let ambientLight = req.body.ambientLight;
  saveSensorData(greenHouseId, temp, humid, soilMoisture, ambientLight);
  new TemperatureCheck(req, res);
});

//Show greenHouseSensorData
router.get("/showGreenHouseSensor", (req, res) => {
  greenHouseSensor.find((err, greenHouseDataList) => {
    if (!err) {
      res.json(greenHouseDataList);
    } else {
      res.json({});
    }
  });
});

//Add projectSensor
router.post("/projectSensor", (req, res) => {
  const newProjectSensorData = {
    projectSensorId: req.body.projectSensorId,
    soilFertilizer: req.body.soilFertilizer,
    timeStamp: req.body.timeStamp,
    projectId: req.body.projectId
  };

  new projectSensor(newProjectSensorData).save(function (err) {
    if (!err) {
      console.log("created");
      res.sendStatus(200);
    } else {
      //TODO: return page with errors
      return console.log(err);
    }
  });
});

//Show Project Sensor Data
router.get("/showProjectData", (req, res) => {
  projectSensor.find((err, projectDataList) => {
    if (!err) {
      res.json(projectDataList);
    } else {
      res.json({});
    }
  });
});

module.exports = router;