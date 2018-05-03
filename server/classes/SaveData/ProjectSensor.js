const mongoose = require("mongoose");
const projectSensor = mongoose.model("project_Sensor");
const know_controller = mongoose.model("know_controller");

let controllerData;

export default class ProjectSensor {
  constructor(req, res) {
    this.process(req, res);
  }

  async process(req, res) {
    let ip = req.body.ip;
    console.log("ip: " + req.body.ip);
    await getControllerData(ip);
    console.log(controllerData.projectId);
    let soilFertilizer = req.body.soilFertilizer;
    let projectId = controllerData.projectId;
    let greenHouseId = controllerData.greenHouseId;
    saveSensorData(soilFertilizer, projectId, greenHouseId);
  }
}

async function getControllerData(ip) {
  console.log("enter 0");
  let controllerResult = await know_controller.findOne(
    {
      ip: ip
    },
    function(err, result) {
      if (err) {
        console.log("Query fail!");
      } else {
        controllerData = result;
        console.log("Result enter 0: " + controllerData);
      }
    }
  );
}

async function saveSensorData(soilFertilizer, projectId, greenHouseId) {
  const newProjectData = {
    soilFertilizer: soilFertilizer,
    timeStamp: Date.now(),
    projectId: projectId,
    greenHouseId: greenHouseId
  };

  new projectSensor(newProjectData).save(function(err) {
    if (!err) {
      console.log("create new project sensor data!");
    } else {
      //TODO: return page with errors
      return console.log(err);
    }
  });
}
