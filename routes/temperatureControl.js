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
let minTemperature;
let maxTemperature;
let minHumidity;
let maxHumidity;
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
  let configFilePath = farmData[0].configFilePath;
  let config = JSON.parse(
    require("fs").readFileSync(String(configFilePath), "utf8")
  );
  configFile = config;
}

async function getControllerData(greenHouseId) {
  let controllerResult = await know_controller.find({
    isHavePump: true,
    pumpType: "moisture",
    greenHouseId: greenHouseId
  });
  if (controllerResult) {
    controllerData = controllerResult;
  } else {
    controllerData = undefined;
    console.log("Query fail!");
  }
}

function compareTemperature(configFile, currentTemp) {
  minTemperature = configFile.minTemperature;
  maxTemperature = configFile.maxTemperature;
  console.log("MIN-T: " + minTemperature);
  console.log("MAX-T: " + maxTemperature);
  console.log("CURRENT-T: " + currentTemp);
  if (minTemperature == null || maxTemperature == null) {
    return undefined;
  } else if (maxTemperature < currentTemp) {
    return false;
  } else if (minHumidity > currentTemp) {
    return true;
  }
}

function compareHumidity(configFile, currentHumid) {
  minHumidity = configFile.minHumidity;
  maxHumidity = configFile.maxHumidity;
  console.log("MIN-H: " + minHumidity);
  console.log("MAX-H: " + maxHumidity);
  console.log("CURRENT-H: " + currentHumid);
  if (minHumidity == null || maxHumidity == null) {
    return undefined;
  } else if (minHumidity < currentHumid) {
    return true;
  } else if (minHumidity > currentHumid) {
    return false;
  }
}

function onOffWaterPump(ip, state) {
  if (state) {
    console.log("Send: /waterPump?params=0 (on)");
    request
      .get("http://" + String(ip) + "/waterPump?params=0", { timeout: 5000 })
      .on("error", function(err) {
        console.log(err.code === "ETIMEDOUT");
        console.log(err.connect === true);
        console.log(err);
      });
  } else {
    console.log("Send: /waterPump?params=1 (off)");
    request
      .get("http://" + String(ip) + "/waterPump?params=0", { timeout: 5000 })
      .on("error", function(err) {
        console.log(err.code === "ETIMEDOUT");
        console.log(err.connect === true);
        console.log(err);
      });
  }
}

router.use("/", (req, res, next) => {
  async function getData(ip) {
    let controllerResult = await know_controller.find({
      ip: ip
    });
    if (controllerResult) {
      res.controllerDataRes = controllerResult;
    } else {
      console.log("Query fail!");
    }
    next();
  }
  getData(req.body.ip);
});

router.post("/", (req, res) => {
  async function getPathData() {
    let greenHouseId = res.controllerDataRes[0].greenHouseId;
    await getControllerData(greenHouseId);
    if (typeof controllerData === "undefined") {
      res.sendStatus(200);
    }
    let farmId = controllerData[0].farmId;
    await getConfigFile(farmId);
    let resultCompareHumid = await compareHumidity(
      configFile,
      req.body.humidity
    );
    let resultCompareTemp = await compareTemperature(
      configFile,
      req.body.temperature
    );
    console.log("compareTemp: " + resultCompareTemp);
    console.log("compareHumid: " + resultCompareHumid);
    if (
      typeof resultCompareTemp === "undefined" ||
      typeof resultCompareHumid === "undefined"
    ) {
      res.sendStatus(500);
    } else {
      if (!resultCompareTemp) {
        onOffWaterPump(controllerData[0].ip, true);
      }
      if (!resultCompareHumid) {
        onOffWaterPump(controllerData[0].ip, true);
      }
      if (resultCompareTemp && resultCompareHumid) {
        onOffWaterPump(controllerData[0].ip, false);
      }
      res.sendStatus(200);
    }
  }
  getPathData();
});

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

router.use("/configTemperature", (req, res, next) => {
  async function preTasks() {
    let farmId = req.body.farmId;
    await getConfigFile(farmId);
    next();
  }
  preTasks();
});

router.post("/configTemperature", (req, res) => {
  let minConfigTemp = req.body.minTemperature;
  let maxConfigTemp = req.body.maxTemperature;
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
});

router.use("/configHumidity", (req, res, next) => {
  async function preTasks() {
    let farmId = req.body.farmId;
    await getConfigFile(farmId);
    next();
  }
  preTasks();
});

router.post("/configHumidity", (req, res) => {
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
});

async function getGreenhouseSensor(greenHouseId) {
  let result = await greenHouseSensor.findOne(
    {
      greenHouseId: greenHouseId
    },
    {},
    { sort: { _id: -1 } }
  );
  if (result) {
    greenHouseSensorData = result;
  } else {
    greenHouseSensorData = undefined;
    console.log("Query fail!");
  }
  console.log(greenHouseSensorData);
}

router.use("/showTemperature", (req, res, next) => {
  async function getData() {
    let greenHouseId = req.body.greenHouseId;
    let farmId = req.body.farmId;
    console.log(greenHouseId);
    console.log(farmId);
    await getGreenhouseSensor(greenHouseId);
    await getConfigFile(farmId);
    next();
  }
  getData();
});

router.post("/showTemperature", (req, res) => {
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
});

router.use("/showHumidity", (req, res, next) => {
  async function getData() {
    let greenHouseId = req.body.greenHouseId;
    let farmId = req.body.farmId;
    console.log(greenHouseId);
    console.log(farmId);
    await getGreenhouseSensor(greenHouseId);
    await getConfigFile(farmId);
    next();
  }
  getData();
});

router.post("/showHumidity", (req, res) => {
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
});

module.exports = router;
