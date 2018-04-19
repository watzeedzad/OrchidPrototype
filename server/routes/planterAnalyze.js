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
  fs.writeFileSync(String(configFilePath), content, "utf8", function(err) {
    if (err) {
      console.log(err);
    } else {
      console.log("write with no error");
    }
  });
}

async function getProjectSensor(projectId) {
  let result = await project_sensor.findOne(
    {
      projectId: projectId
    },
    {},
    {
      sort: { _id: -1 }
    },
    function(err, result) {
      if (err) {
        console.log("ProjectSensor Query Failed!");
        projectSensorData = undefined;
      } else {
        projectSensorData = result;
      }
    }
  );
}

router.use("/configFertility", (req, res, next) => {
  async function preTasks() {
    let farmId = req.body.farmId;
    await getConfigFile(farmId);
    next();
  }
  preTasks();
});

router.post("/configFertility", (req, res) => {
  let minConfigFertility = req.body.minFertility;
  let maxConfigFertility = req.body.maxFertility;
  configFile.minFertility = minConfigFertility;
  configFile.maxFertility = maxConfigFertility;
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
    writeFile();
  }
});

router.use("/configSoilMoisture", (req, res, next) => {
  async function preTasks() {
    let farmId = req.body.farmId;
    await getConfigFile(farmId);
    next();
  }
  preTasks();
});

router.post("/configSoilMoisture", (req, res) => {
  let minConfigSoilMois = req.body.minSoilMoisture;
  let maxConfigSoilMois = req.body.maxSoilMoisture;
  configFile.minSoilMoisture = minConfigSoilMois;
  configFile.maxSoilMoisture = maxConfigSoilMois;
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
    writeFile();
  }
});

router.use("/showFertility", (req, res, next) => {
    async function getData() {
        let farmId = req.body.farmId;
        let projectId = req.body.projectId;
        console.log("farmId: " + farmId);
        console.log("projectId: " + projectId);
        await getProjectSensor(projectId);
        await getConfigFile(farmId);
        next();
    }
    getData();
});

router.post("/showFertility", (req, res) => {
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
        let cuurentFertility = projectSensorData.fertility;
        var showFertility = {
            minConfigFertility: minConfigFertility,
            maxConfigFertility: maxConfigFertility,
            cuurentFertility: cuurentFertility
        };
        res.json(showFertility);
    }
});

module.exports = router;