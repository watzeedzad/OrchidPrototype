const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const fs = require("fs");
const request = require("request");
const farm = mongoose.model("farm");
const know_controller = mongoose.model("know_controller");
const greenHouseSensor = mongoose.model("greenHouse_Sensor");

let configFile;
let controllerData;
let greenHouseSensorData;

async function getConfigFile() {
  console.log("getConfigFilePath: " + pathGlobal);
  let config = JSON.parse(
    require("fs").readFileSync(String(pathGlobal), "utf8")
  );
  configFile = config;
}

async function writeConfigFile(configFile) {
  let content = JSON.stringify(configFile);
  fs.writeFileSync(String(pathGlobal), content, "utf8", function (err) {
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
    if (pathGlobal == null) {
      res.sendStatus(500);
    }
    await getConfigFile();
    if (typeof configFile === "undefined") {
      res.sendStatus(500);
    }
    let minConfigTemp = parseFloat(req.body.minTemperature);
    console.log("minConfigTemp: " + minConfigTemp);
    let maxConfigTemp = parseFloat(req.body.maxTemperature);
    console.log("maxConfigTemp: " + maxConfigTemp);
    async function writeFile() {
      await writeConfigFile(configFile);
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
      configFile.minTemperature = minConfigTemp;
      configFile.maxTemperature = maxConfigTemp;
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
    if (pathGlobal == null) {
      res.sendStatus(500);
    }
    await getConfigFile();
    if (typeof configFile === "undefined") {
      res.sendStatus(500);
    }
    let minConfigHumid = parseFloat(req.body.minHumidity);
    console.log("minConfigJumid: " + minConfigHumid);
    let maxConfigHumid = parseFloat(req.body.maxHumidity);
    console.log("maxConfigHumid: " + maxConfigHumid);
    async function writeFile() {
      await writeConfigFile(configFile);
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
      configFile.minHumidity = minConfigHumid;
      configFile.maxHumidity = maxConfigHumid;
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
    if (pathGlobal == null) {
      res.sendStatus(500);
    }
    console.log("Global: " + farmIdGlobal);
    let greenHouseId = parseFloat(req.body.greenHouseId);
    console.log("showTemp: " + greenHouseId);
    await getGreenhouseSensor(greenHouseId);
    await getConfigFile();
    if (typeof greenHouseSensorData === "undefined") {
      res.sendStatus(500);
    } else if (typeof configFile === "undefined") {
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
    if (pathGlobal == null) {
      res.sendStatus(500);
    }
    console.log("Global: " + farmIdGlobal);
    let greenHouseId = parseFloat(req.body.greenHouseId);
    console.log(greenHouseId);
    await getGreenhouseSensor(greenHouseId);
    await getConfigFile();
    if (typeof greenHouseSensorData === "undefined") {
      res.sendStatus(500);
    } else if (typeof configFile === "undefined") {
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