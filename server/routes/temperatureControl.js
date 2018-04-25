const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const fs = require("fs");
const request = require("request");
const farm = mongoose.model("farm");
const know_controller = mongoose.model("know_controller");
const greenHouseSensor = mongoose.model("greenHouse_Sensor");

let farmData;
let configFile;
let controllerData;
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
  console.log("getConfigFile: " + farmData);
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

router.use("/configTemperature", (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  res.set("Content-Type", "application/json");
  next();
});

router.post("/configTemperature", (req, res) => {
  async function setConfig() {
    let farmId = req.body.farmId;
    await getConfigFile(farmId);
    let minConfigTemp = req.body.minTemperature;
    console.log("minConfigTemp: " + minConfigTemp);
    let maxConfigTemp = req.body.maxTemperature;
    console.log("maxConfigTemp: " + maxConfigTemp);
    configFile.minTemperature = minConfigTemp;
    configFile.maxTemperature = maxConfigTemp;
    async function writeFile() {
      await writeConfigFile(req.body.farmId, configFile);
      res.sendStatus(200);
    }
    if (
      typeof minConfigTemp === "undefined" ||
      typeof maxConfigTemp === "undefined"
    ) {
      res.sendStatus(500);
    } else if (minConfigTemp > maxConfigTemp) {
      res.sendStatus(500);
    } else {
      writeFile();
    }
  }
  setConfig();
});

router.use("/configHumidity", (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  res.set("Content-Type", "application/json");
  next();
});

router.post("/configHumidity", (req, res) => {
  async function setConfig() {
    let farmId = req.body.farmId;
    await getConfigFile(farmId);
    let minConfigHumid = req.body.minHumidity;
    let maxConfigHumid = req.body.maxHumidity;
    configFile.minHumidity = minConfigHumid;
    configFile.maxHumidity = maxConfigHumid;
    async function writeFile() {
      await writeConfigFile(req.body.farmId, configFile);
      res.sendStatus(200);
    }
    if (
      typeof minConfigHumid === "undefined" ||
      typeof maxConfigHumid === "undefined"
    ) {
      res.sendStatus(500);
    } else if (minConfigHumid > maxConfigHumid) {
      res.sendStatus(500);
    } else {
      writeFile();
    }
  }
  setConfig();
});

router.use("/showTemperature", (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  res.set("Content-Type", "application/json");
  next();
});

router.post("/showTemperature", (req, res) => {
  async function getData() {
    let greenHouseId = req.body.greenHouseId;
    let farmId = req.body.farmId;
    console.log("showTemp: " + greenHouseId);
    console.log("showTemp: " + farmId);
    await getGreenhouseSensor(greenHouseId);
    await getConfigFile(farmId);
    if (typeof greenHouseSensorData === "undefined") {
      res.sendStatus(500);
    } else if (
      configFile.minTemperature == null ||
      configFile.maxTemperature == null
    ) {
      res.sendStatus(500);
    } else {
      let minConfigTemp = configFile.minTemperature;
      let maxConfigTemp = configFile.maxTemperature;
      let currentTemp = greenHouseSensorData.temperature;
      var showTemp = {
        minConfigTemperature: minConfigTemp,
        maxConfigTemperature: maxConfigTemp,
        currentTemperature: currentTemp
      };
      res.json(showTemp);
    }
  }
  getData();
});

router.use("/showHumidity", (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  res.set("Content-Type", "application/json");
  next();
});

router.post("/showHumidity", (req, res) => {
  async function getData() {
    let greenHouseId = req.body.greenHouseId;
    let farmId = req.body.farmId;
    console.log(greenHouseId);
    console.log(farmId);
    await getGreenhouseSensor(greenHouseId);
    await getConfigFile(farmId);
    if (typeof greenHouseSensorData === "undefined") {
      res.sendStatus(500);
    } else if (
      configFile.minTemperature == null ||
      configFile.maxTemperature == null
    ) {
      res.sendStatus(500);
    } else {
      let minConfigHumid = configFile.minHumidity;
      let maxConfigHumid = configFile.maxHumidity;
      let currentHumid = greenHouseSensorData.humidity;
      var showTemp = {
        minConfigHumidity: minConfigHumid,
        maxConfigHumidity: maxConfigHumid,
        currentHumidity: currentHumid
      };
      res.json(showTemp);
    }
  }
  getData();
});

module.exports = router;