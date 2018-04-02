const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const greenHouseSensor = mongoose.model("greenHouse_Sensor");
const projectSensor = mongoose.model("project_Sensor");

//Add greenHouseSensor
router.post("/greenHouseSensor", (req, res) => {
  const newGreenHouseData = {
    greenHouseSensorId: req.body.greenHouseId,
    temperature: req.body.temperature,
    humidity: req.body.humidity,
    soilMoisture: req.body.soilMoisture,
    ambientLight: req.body.ambientLight,
    timeStamp: req.body.timeStamp,
    greenHouseId: req.body.greenHouseId
  };

  new greenHouseSensor(newGreenHouseData).save(function(err) {
    if (!err) {
      console.log("created");
      // res.sendStatus(200);
    } else {
      //TODO: return page with errors
      return console.log(err);
    }
  });
  res.redirect(307, "../temperatureControl");
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

  new projectSensor(newProjectSensorData).save(function(err) {
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
