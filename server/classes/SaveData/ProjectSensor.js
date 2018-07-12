const mongoose = require("mongoose");
const projectSensor = mongoose.model("project_Sensor");
const know_controller = mongoose.model("know_controller");
const farm = mongoose.model("farm");

let controllerData;
let farmData;

export default class ProjectSensor {
  constructor(req, res) {
    this.process(req, res);
  }

  async process(req, res) {
    let ip = req.body.ip;
    console.log("[ProjectSensor] ip: " + req.body.ip);
    let piMacAddress = req.body.macAddress;
    await getFarmData(piMacAddress);
    await getControllerData(ip, piMacAddress);
    let soilFertilizer = req.body.soilFertilizer;
    let projectId = controllerData.projectId;
    let greenHouseId = controllerData.greenHouseId;
    saveSensorData(soilFertilizer, projectId, greenHouseId, farmData.farmId);
  }
}

async function getControllerData(ip, macAddress) {
  let controllerResult = await know_controller.findOne({
      ip: ip,
      piMacAddress: macAddress
    },
    function (err, result) {
      if (err) {
        console.log("[ProjectSensor] getControllerData, Query fail!");
      } else {
        controllerData = result;
      }
    }
  );
}

async function getFarmData(piMacAddress) {
  await farm.findOne({
    piMacAddress: piMacAddress
  }, function (err, result) {
    if (err) {
      console.log("[ProjectSensor] getFarmData, Query failed");
    } else {
      farmData = result;
    }
  });
}

async function saveSensorData(soilFertilizer, projectId, greenHouseId, farmId) {
  const newProjectData = {
    soilFertilizer: soilFertilizer,
    timeStamp: Date.now(),
    projectId: projectId,
    greenHouseId: greenHouseId,
    farmId: farmId
  };

  new projectSensor(newProjectData).save(function (err) {
    if (!err) {
      console.log("[ProjectSensor] create new project sensor data!");
    } else {
      //TODO: return page with errors
      return console.log(err);
    }
  });
}