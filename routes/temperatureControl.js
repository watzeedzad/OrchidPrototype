const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const fs = require("fs");
const request = require("request");
const farm = mongoose.model("farm");
const know_controller = mongoose.model("know_controller");

let filePathJson;
let filePath;
let configFile;
let minTemperature;
let maxTemperature;
let minHumidity;
let maxHumidity;
let controllerData;

async function getFarmData(farmIdIn) {
  var farmData = await farm.find({
    farmId: farmIdIn
  });
  if (farmData) {
    filePathJson = JSON.stringify(farmData);
  } else {
    console.log("fail");
  }
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

function compareTemperature(filePath, currentTemp) {
  configFile = JSON.parse(require("fs").readFileSync(String(filePath), "utf8"));
  minTemperature = configFile.minTemperature;
  maxTemperature = configFile.maxTemperature;
  if (maxTemperature < currentTemp) {
    return false;
  }
  if (minHumidity > currentTemp) {
    return true;
  }
}

function compareHumidity(filePath, currentHumid) {
  configFile = JSON.parse(require("fs").readFileSync(String(filePath), "utf8"));
  minHumidity = configFile.minHumidity;
  maxHumidity = configFile.maxHumidity;
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
    await getFarmData(farmId);
    const temp = JSON.parse(filePathJson);
    filePath = temp[0].configFilePath;
    let resultCompareTemp = await compareTemperature(
      filePath,
      req.body.temperature
    );
    let resultCompareHumid = await compareHumidity(filePath, req.body.humidity);
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
  getPathData();
});

module.exports = router;
