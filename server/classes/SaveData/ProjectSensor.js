const mongoose = require("mongoose");
const projectSensor = mongoose.model("project_Sensor");
const know_controller = mongoose.model("know_controller");
const farm = mongoose.model("farm");

let controllerData;
let farmData;

export default class ProjectSensor {
  constructor(req) {
    this.process(req);
  }

  async process(req) {
    let greenHouseId = req.body.greenHouseId;
    let soilFertility = req.body.soilFertility;
    let projectId = req.body.projectId;
    let farmId = req.body.farmId;
    console.log("[ProjectSensor] greenHouseId: " + greenHouseId);
    console.log("[ProjectSensor] projectId: " + projectId);
    console.log("[ProjectSensor] farmId: " + farmId);
    console.log("[ProjectSensor] soilFertility: " + soilFertility);
    setTimeout(() => {
      saveSensorData(soilFertility, projectId, greenHouseId, farmId);
    }, 500);
  }
}

async function saveSensorData(soilFertility, projectId, greenHouseId, farmId) {
  const newProjectData = {
    soilFertility: soilFertility,
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