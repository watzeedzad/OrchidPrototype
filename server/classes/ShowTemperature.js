const mongoose = require("mongoose");
const fs = require("fs");
const greenHouseSensor = mongoose.model("greenHouse_Sensor");

let configFile;
let greenHouseSensorData;

export default class ShowTemprature {
  constructor(req, res) {
    this.process(req, res);
  }

  async process(req, res) {
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
}

async function getGreenhouseSensor(greenHouseId) {
  let result = await greenHouseSensor.findOne(
    {
      greenHouseId: greenHouseId
    },
    {},
    {
      sort: {
        _id: -1
      }
    }
  );
  if (result) {
    greenHouseSensorData = result;
  } else {
    greenHouseSensorData = undefined;
    console.log("Query fail!");
  }
  console.log(greenHouseSensorData);
}

async function getConfigFile() {
  console.log("getConfigFilePath: " + pathGlobal);
  let config = JSON.parse(
    require("fs").readFileSync(String(pathGlobal), "utf8")
  );
  configFile = config;
}
