const fs = require("fs");
const mongoose = require("mongoose");
const project_sensor = mongoose.model("project_Sensor");

let configFile;
let projectSensorData;

export default class ShowAllFertility {
  constructor(req, res) {
    this.process(req, res);
  }

  async process(req, res) {

  }
}

async function getConfigFile() {
  console.log("getConfigFilePath: " + pathGlobal);
  let config = JSON.parse(
    require("fs").readFileSync(String(pathGlobal), "utf8")
  );
  configFile = config;
}

async function getProjectSensor(projectId) {
  let result = await project_sensor.find(
    {
      projectId: projectId
    },
    function(err, result) {
      if (err) {
        console.log("ProjectSensor Query Failed!");
        projectSensorData = undefined;
      } else {
        projectSensorData = result;
      }
    }
  );
}
