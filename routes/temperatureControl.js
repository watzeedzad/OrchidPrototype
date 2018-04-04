const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const fs = require("fs");
const unirest = require("unirest");
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
    unirest
      .get("http://" + String(ip) + "/waterPump?params=0")
      .end(function (res) {
        if (res.error) {
          console.log("GET error", res.error);
        } else {
          console.log("GET response", res.body);
        }
      });
  } else {
    unirest
      .get("http://" + String(ip) + "/waterPump?params=1")
      .end(function (res) {
        if (res.error) {
          console.log("GET error", res.error);
        } else {
          console.log("GET response", res.body);
        }
      });
  }
}

router.post("/", (req, res) => {
  async function getPathData() {
    await getControllerData(req.body.greenHouseId);
    if (controllerData == null) {
      res.sendStatus(200);
    }
    let farmId = controllerData[0].farmId;
    await getFarmData(farmId);
    const temp = JSON.parse(filePathJson);
    filePath = temp[0].configFilePath;
    console.log("filePath: " + filePath);
    console.log("temp: " + req.body.temperature);
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