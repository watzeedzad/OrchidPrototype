const mongoose = require("mongoose");
const greenHouseSensor = mongoose.model("greenHouse_Sensor");
const know_controller = mongoose.model("know_controller");
const farm = mongoose.model("farm");
const syncNode = require("sync-node");
const jobQueue = syncNode.createQueue();

let controllerData;
let farmData;

export default class GreenHouseSensor {
  constructor(req) {
    this.process(req);
  }

  async process(req) {
    let greenHouseId = req.body.greenHouseId;
    let farmId = req.body.farmId;
    let temp = req.body.temperature;
    let humid = req.body.humidity;
    let soilMoisture = req.body.soilMoisture;
    let ambientLight = req.body.ambientLight;
    setTimeout(() => {
      saveSensorData(greenHouseId, farmId, temp, humid, soilMoisture, ambientLight)
    }, 500);
  }
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
  console.log("[GreenHouseSensor] saveSensorData (farmId): " + farmId);
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