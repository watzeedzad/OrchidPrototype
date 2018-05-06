const fs = require("fs");
const mongoose = require("mongoose");
const project_sensor = mongoose.model("project_Sensor");

let configFile;
let projectSensorResult;

export default class ShowFertilityHistory {
  constructor(req, res) {
    this.process(req, res);
  }

  async process(req, res) {
    if (pathGlobal == null) {
      res.sendStatus(500);
    }
    let projectId = parseInt(req.body.projectId);
    console.log("projectId-ShowAllFertility: " + projectId);
    await getConfigFile();
    await getProjectSensor(projectId, function(error, result) {
      projectSensorResult = result;
    });
    if (typeof projectSensorResult === "undefined") {
      console.log("projectSensorResult undefined");
      res.sendStatus(500);
    } else if (typeof configFile === "undefined") {
      console.log("configFile undefined");
      res.sendStatus(500);
    } else if (
      configFile.minFertility == null ||
      configFile.maxFertility == null
    ) {
      console.log("min max undefined");
      res.sendStatus(500);
    } else {
      let minConfigFertility = configFile.minFertility;
      let maxConfigFertility = configFile.maxFertility;
      var showAllFertility = {
        minConfigFertility: minConfigFertility,
        maxConfigFertility: maxConfigFertility,
        fertilityHistory: [
          {
            projectId: projectSensorResult[0].projectId,
            currentFertility: projectSensorResult[0].soilFertilizer
          }
        ]
      };
      for (let index = 1; index < projectSensorResult.length; index++) {
        var temp = {
          projectId: projectSensorResult[index].projectId,
          currentFertility: projectSensorResult[index].soilFertilizer
        };
        showAllFertility.fertilityHistory.push(temp);
      }
      res.json(showAllFertility);
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

async function getProjectSensor(projectId, callback) {
  let tempDate = await Date.now();
  await project_sensor.find(
    { projectId: projectId },
    {},
    {
      createdAt: { $gt: new Date(Date.now() - 12 * 60 * 60 * 1000) }
    },
    (err, projectSensorList) => {
      if (err) {
        console.log("Query fail");
        console.log(err);
        return callback(err);
      } else if (projectSensorList) {
        return callback(null, projectSensorList);
      } else {
        return callback();
      }
    }
  );
}
