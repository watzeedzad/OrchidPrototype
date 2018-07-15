const mongoose = require("mongoose");
const greenHouseSensor = mongoose.model("greenHouse_Sensor");
const know_controller = mongoose.model("know_controller");
const farm = mongoose.model("farm");

let controllerData;
let farmData;

export default class GreenHouseSensor {
  constructor(req, res) {
    this.process(req, res);
  }

  async process(req, res) {
    let ip = req.body.ip;
    let piMacAddress = req.body.piMacAddress;
    console.log("[GreenHouseSensor] ip: " + req.body.ip);
    console.log("[GreenHouseSensor] piMacAddress: " + req.body.piMacAddress);
    await getControllerData(ip, piMacAddress);
    await getFarmData(piMacAddress);
    let greenHouseId = controllerData.greenHouseId;
    let temp = req.body.temperature;
    let humid = req.body.humidity;
    let soilMoisture = req.body.soilMoisture;
    let ambientLight = req.body.ambientLight;
    saveSensorData(greenHouseId, farmData.farmId, temp, humid, soilMoisture, ambientLight);
  }
}

async function getControllerData(ip, piMacAddress) {
  console.log("[GreenHouseSensor] getControllerData: " + ip + ", " + piMacAddress);
  await know_controller.findOne({
      ip: ip,
      piMacAddress: piMacAddress
    },
    function (err, result) {
      if (err) {
        console.log("[GreenHouseSensor] getControllerData, Query fail!");
      } else if (!result) {
        console.log("[GreenHouseSensor] getControllerData (!result): " + result);
      } else {
        controllerData = result;
        // console.log("[GreenHouseSensor] getControllerData: " + controllerData);
      }
    }
  );
}

async function getFarmData(piMacAddress) {
  console.log("[GreenHouseSEnsor] getFarmData: " + piMacAddress);
  await farm.findOne({
    piMacAddress: piMacAddress
  }, function (err, result) {
    if (err) {
      console.log("[GreenHouseSensor] getFarmData, Query failed");
    } else {
      farmData = result;
      // console.log("[GreenHouseSensor] getFarmData: " + result);
    }
  });
}

async function saveSensorData(
  greenHouseId,
  farmId,
  temp,
  humid,
  soilMoisture,
  ambientLight
) {
  console.log("[GreenHouseSensor] saveSensorData (greenHouseId): " + greenHouseId);
  console.log("[GreenHouseSensor] savwSensorData (farmId): " + farmId);
  const newGreenHouseData = {
    temperature: temp,
    humidity: humid,
    soilMoisture: soilMoisture,
    ambientLight: ambientLight,
    timeStamp: Date.now(),
    greenHouseId: greenHouseId,
    farmId: farmId
  };

  new greenHouseSensor(newGreenHouseData).save(function (err) {
    if (!err) {
      console.log("[GreenHouseSensor] created green house!");
    } else {
      //TODO: return page with errors
      return console.log(err);
    }
  });
}