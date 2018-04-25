const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const fs = require("fs");
const request = require("request");
const farm = mongoose.model("farm");
const project_sensor = mongoose.model("project_Sensor");
const greenHouseSensor = mongoose.model("greenHouse_Sensor");

let farmData;
let configFile;
let projectSensorData;
let greenHouseSensorData;

async function getConfigFile(farmIdIn) {
  var farmResult = await farm.find({
    farmId: farmIdIn
  });
  if (farmResult) {
    farmData = farmResult;
  } else {
    console.log("fail");
  }
  let configFilePath = farmData[0].configFilePath;
  let config = JSON.parse(
    require("fs").readFileSync(String(configFilePath), "utf8")
  );
  configFile = config;
}

async function writeConfigFile(farmId, configFile) {
  var farmData = await farm.find({
    farmId: farmId
  });
  if (farmData) {
    farmData = JSON.stringify(farmData);
  } else {
    console.log("fail");
  }
  let temp = JSON.parse(farmData);
  let configFilePath = temp[0].configFilePath;
  let content = JSON.stringify(configFile);
  fs.writeFileSync(String(configFilePath), content, "utf8", function (err) {
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
});

router.post("/configFertility", (req, res) => {
  async function setConfig() {
    let farmId = req.body.farmId;
    await getConfigFile(farmId);
    let minConfigFertility = req.body.minFertility;
    let maxConfigFertility = req.body.maxFertility;
    async function writeFile() {
      await writeConfigFile(req.body.farmId, configFile);
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
    let farmId = req.body.farmId;
    await getConfigFile(farmId);
    let minConfigSoilMois = req.body.minSoilMoisture;
    let maxConfigSoilMois = req.body.maxSoilMoisture;
    async function writeFile() {
      await writeConfigFile(req.body.farmId, configFile);
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
    let farmId = req.body.farmId;
    let projectId = req.body.projectId;
    console.log("farmId: " + farmId);
    console.log("projectId: " + projectId);
    await getProjectSensor(projectId);
    await getConfigFile(farmId);
    if (typeof projectSensorData === "undefined") {
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
    let farmId = req.body.farmId;
    let greenHouseId = req.body.greenHouseId;
    console.log("showSoilMoisture: " + greenHouseId);
    console.log("showSoilMoisture: " + farmId);
    await getGreenhouseSensor(greenHouseId);
    await getConfigFile(farmId);
    if (typeof greenHouseSensorData === "undefined") {
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