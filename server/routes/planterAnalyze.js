const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const fs = require("fs");
const request = require("request");
const farm = mongoose.model("farm");
const project_sensor = mongoose.model("project_Sensor");
const greenHouseSensor = mongoose.model("greenHouse_Sensor");

let configFile;
let projectSensorData;
let greenHouseSensorData;

async function getConfigFile() {
  let config = JSON.parse(
    require("fs").readFileSync(String(pathGlobal), "utf8")
  );
  configFile = config;
}

async function writeConfigFile(configFile) {
  fs.writeFileSync(String(pathGlobal), content, "utf8", function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log("write with no error");
    }
  });
}

async function getProjectSensor(projectId) {
  let result = await project_sensor.findOne({
      projectId: projectId
    }, {}, {
      sort: {
        _id: -1
      }
    },
    function (err, result) {
      if (err) {
        console.log("ProjectSensor Query Failed!");
        projectSensorData = undefined;
      } else {
        projectSensorData = result;
      }
    }
  );
}

async function getGreenhouseSensor(greenHouseId) {
  let result = await greenHouseSensor.findOne({
    greenHouseId: greenHouseId
  }, {}, {
    sort: {
      _id: -1
    }
  });
  if (result) {
    greenHouseSensorData = result;
  } else {
    greenHouseSensorData = undefined;
    console.log("Query fail!");
  }
  console.log(greenHouseSensorData);
}

router.use("/configFertility", (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  res.set("Content-Type", "application/json");
  next();
});

router.post("/configFertility", (req, res) => {
  async function setConfig() {
    await getConfigFile();
    if (typeof configFile === "undefined") {
      res.sendStatus(500);
    }
    let minConfigFertility = parseFloat(req.body.minFertility);
    let maxConfigFertility = parseFloat(req.body.maxFertility);
    async function writeFile() {
      await writeConfigFile(configFile);
      res.sendStatus(200);
    }
    if (
      typeof minConfigFertility === "undefined" ||
      typeof maxConfigFertility === "undefined"
    ) {
      res.sendStatus(500);
    } else if (minConfigFertility > maxConfigFertility) {
      res.sendStatus(500);
    } else {
      configFile.minFertility = minConfigFertility;
      configFile.maxFertility = maxConfigFertility;
      writeFile();
    }
  }
});

router.use("/configSoilMoisture", (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  res.set("Content-Type", "application/json");
  next();
});

router.post("/configSoilMoisture", (req, res) => {
  async function setConfig() {
    await getConfigFile();
    if (typeof configFile === "undefined") {
      res.sendStatus(500);
    }
    let minConfigSoilMois = parseInt(req.body.minSoilMoisture);;
    let maxConfigSoilMois = parseInt(req.body.maxSoilMoisture);;
    async function writeFile() {
      await writeConfigFile(configFile);
      res.sendStatus(200);
    }
    if (
      typeof minConfigSoilMois === "undefined" ||
      typeof maxConfigSoilMois === "undefined"
    ) {
      res.sendStatus(500);
    } else if (minConfigSoilMois > maxConfigSoilMois) {
      res.sendStatus(500);
    } else {
      configFile.minSoilMoisture = minConfigSoilMois;
      configFile.maxSoilMoisture = maxConfigSoilMois;
      writeFile();
    }
  }
});

router.use("/showFertility", (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  res.set("Content-Type", "application/json");
  next();
});

router.post("/showFertility", (req, res) => {
  async function getData() {
    let projectId = parseInt(req.body.projectId);
    console.log("projectId: " + projectId);
    await getProjectSensor(projectId);
    await getConfigFile();
    if (typeof projectSensorData === "undefined") {
      res.sendStatus(500);
    } else if (typeof configFile === "undefined") {
      res.sendStatus(500);
    } else if (
      configFile.minFertility == null ||
      configFile.maxFertility == null
    ) {
      res.sendStatus(500);
    } else {
      let minConfigFertility = configFile.minFertility;
      let maxConfigFertility = configFile.maxFertility;
      let cuurentFertility = projectSensorData.soilFertilizer;
      var showFertility = {
        minConfigFertility: minConfigFertility,
        maxConfigFertility: maxConfigFertility,
        cuurentFertility: cuurentFertility
      };
      res.json(showFertility);
    }
  }
  getData();
});

router.use("/showSoilMoisture", (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  res.set("Content-Type", "application/json");
  next();
});

router.post("/showSoilMoisture", (req, res, next) => {
  async function setConfig() {
    let greenHouseId = req.body.greenHouseId;
    console.log("showSoilMoisture: " + greenHouseId);
    await getGreenhouseSensor(greenHouseId);
    await getConfigFile();
    if (typeof greenHouseSensorData === "undefined") {
      res.sendStatus(500);
    } else if (typeof configFile === "undefined") {
      res.sendStatus(500);
    } else if (
      configFile.minSoilMoisture == null ||
      configFile.maxSoilMoisture == null
    ) {
      res.sendStatus(500);
    } else {
      let minConfigSoilMois = configFile.minSoilMoisture;
      let maxConfigSoilMois = configFile.maxSoilMoisture;
      let currentSoilMoisture = greenHouseSensorData.soilMoisture;
      var showSoilMoisture = {
        minConfigSoilMoisture: minConfigSoilMois,
        maxConfigSoilMoisture: maxConfigSoilMois,
        currentSoilMoisture: currentSoilMoisture
      };
      res.json(showSoilMoisture);
    }
  }
  setConfig();
});

module.exports = router;