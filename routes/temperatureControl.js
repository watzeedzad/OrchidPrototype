const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const fs = require("fs");
const request = require("request");
const farm = mongoose.model("farm");
const know_controller = mongoose.model("know_controller");

let farmData;
let configFile;
let minTemperature;
let maxTemperature;
let minHumidity;
let maxHumidity;
let controllerData;

async function getConfigFile(farmIdIn) {
  var farmData = await farm.find({
    farmId: farmIdIn
  });
  if (farmData) {
    farmData = JSON.stringify(farmData);
  } else {
    console.log("fail");
  }
  let temp = JSON.parse(farmData);
  let configFilePath = temp[0].configFilePath;
  let config = JSON.parse(
    require("fs").readFileSync(String(configFilePath), "utf8")
  );
  configFile = config;
  console.log(configFile);
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
    controllerData = null;
    console.log("Query fail!");
  }
}

function compareTemperature(configFile, currentTemp) {
  minTemperature = configFile.minTemperature;
  maxTemperature = configFile.maxTemperature;
  if (minTemperature == null || maxTemperature == null) {
    console.log(minTemperature);
    return undefined;
  }
  if (maxTemperature < currentTemp) {
    return false;
  }
  if (minHumidity > currentTemp) {
    return true;
  }
}

function compareHumidity(configFile, currentHumid) {
  minHumidity = configFile.minHumidity;
  maxHumidity = configFile.maxHumidity;
  if (minHumidity == null || maxHumidity == null) {
    return undefined;
  }
  if (minHumidity < currentHumid) {
    return true;
  }
  if (minHumidity > currentHumid) {
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
    let resultCompareTemp = await compareTemperature(
      configFile,
      req.body.temperature
    );
    let resultCompareHumid = await compareHumidity(
      configFile,
      req.body.humidity
    );
    console.log(resultCompareHumid);
    console.log(resultCompareTemp);
    if (
      typeof resultCompareTemp === "undefined" ||
      typeof resultCompareHumid === "undefined"
    ) {
      res.sendStatus(301);
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

router.post("/configTemperature", (req, res) => {
  let minConfigTemp = req.body.minTemperature;
  let maxCOnfigTemp = req.body.maxTemperature;
  let farmId = req.body.farmId;
});

module.exports = router;
