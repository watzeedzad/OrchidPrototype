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

async function getControllerData(ip) {
  let controllerResult = await know_controller.find({
    ip: ip
  });
  if (controllerResult) {
    controllerData = controllerResult;
  } else {
    console.log("Query fail!");
  }
}

function compareTemperature(filePath, currentTemp) {
  configFile = JSON.parse(require("fs").readFileSync(String(filePath), "utf8"));
  minTemperature = configFile.minTemperature;
  maxTemperature = configFile.maxTemperature;
  if (maxTemperature < currentTemp) {
    unirest.get("http://" + String(controllerData[0].ip) + "/waterPump?params=0").end(function(res) {
      if (res.error) {
        console.log("GET error", res.error);
      } else {
        console.log("GET response", res.body);
      }
    });
  } else {
    unirest.get("http://" + String(controllerData[0].ip) + "/waterPump?params=1").end(function(res) {
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
    await getControllerData(req.body.ip);
    let farmId = controllerData[0].farmId;
    await getFarmData(farmId);
    const temp = JSON.parse(filePathJson);
    filePath = temp[0].configFilePath;
    console.log("filePath: " + filePath);
    console.log("temp: " + req.body.temperature)
    await compareTemperature(filePath, req.body.temperature);
    res.sendStatus(200);
  }
  getPathData();
});

module.exports = router;
