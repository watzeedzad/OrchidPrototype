const fs = require("fs");
const mongoose = require("mongoose");
const project_sensor = mongoose.model("project_Sensor");

let configFile;
let projectSensorData;

export default class ShowFertility {
  constructor(req, res) {
    this.process(req, res);
  }

  async process(req, res) {
    if (pathGlobal == null) {
      res.sendStatus(500);
    }
    let projectId = parseInt(req.body.projectId);
    console.log("projectId: " + projectId);
    await getProjectSensor(projectId);
    await getConfigFile();
    if (typeof projectSensorData === "undefined") {
      res.sendStatus(500);
    } else if (typeof configFile === "undefined") {
      res.sendStatus(500);
    } else if (
      configFile.minFertility == null ||
      configFile.maxFertility == null
    ) {
      res.sendStatus(500);
    } else {
      let minConfigFertility = configFile.minFertility;
      let maxConfigFertility = configFile.maxFertility;
      let cuurentFertility = projectSensorData.soilFertilizer;
      var showFertility = {
        minConfigFertility: minConfigFertility,
        maxConfigFertility: maxConfigFertility,
        cuurentFertility: cuurentFertility
      };
      res.json(showFertility);
    }
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
  let result = await project_sensor.findOne(
    {
      projectId: projectId
    },
    {},
    {
      sort: {
        _id: -1
      }
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
