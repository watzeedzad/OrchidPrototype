const mongoose = require("mongoose");
const greenHouseSensor = mongoose.model("greenHouse_Sensor");
const know_controller = mongoose.model("know_controller");

let controllerData;

export default class GreenHouseSensor {
  constructor(req, res) {
    this.process(req, res);
  }

  async process(req, res) {
    let ip = req.body.ip;
    console.log("GreenHouseSensor: ip, " + req.body.ip);
    await getControllerData(ip);
    let greenHouseId = controllerData.greenHouseId;
    let temp = req.body.temperature;
    let humid = req.body.humidity;
    let soilMoisture = req.body.soilMoisture;
    let ambientLight = req.body.ambientLight;
    saveSensorData(greenHouseId, temp, humid, soilMoisture, ambientLight);
  }
}

async function getControllerData(ip) {
  let controllerResult = await know_controller.findOne(
    {
      ip: ip
    },
    function(err, result) {
      if (err) {
        console.log("GreenHouseSensor: getControllerData, Query fail!");
      } else {
        controllerData = result;
      }
    }
  );
}

async function saveSensorData(
  greenHouseId,
  temp,
  humid,
  soilMoisture,
  ambientLight
) {
  const newGreenHouseData = {
    temperature: temp,
    humidity: humid,
    soilMoisture: soilMoisture,
    ambientLight: ambientLight,
    timeStamp: Date.now(),
    greenHouseId: greenHouseId
  };

  new greenHouseSensor(newGreenHouseData).save(function(err) {
    if (!err) {
      console.log("GreenHouseSensor: created green house!");
    } else {
      //TODO: return page with errors
      return console.log(err);
    }
  });
}
