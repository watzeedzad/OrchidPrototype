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
    if (pathGlobal == null) {
      res.sendStatus(500);
    }
    let greenHouseId = parseInt(req.body.greenHouseId);
    console.log("greenHouseId-ShowAllFertility: " + greenHouseId);
    await getConfigFile();
    await getProjectSensor(greenHouseId);
    if (typeof projectSensorData === "undefined") {
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
      let countProjectId = [];
      let projectSensorDataSplice = [];
      for (let index = 0; index < projectSensorData.length; index++) {
        if (!countProjectId.includes(projectSensorData[index].projectId)) {
          projectSensorDataSplice.push(projectSensorData[index]);
          countProjectId.push(projectSensorData[index].projectId);
        }
      }
      let minConfigFertility = configFile.minFertility;
      let maxConfigFertility = configFile.maxFertility;
      var showAllFertility = {
        minConfigFertility: minConfigFertility,
        maxConfigFertility: maxConfigFertility,
        allFertility: [
          {
            projectId: projectSensorDataSplice[0].projectId,
            currentFertility: projectSensorDataSplice[0].soilFertilizer
          }
        ]
      };
      for (let index = 1; index < projectSensorDataSplice.length; index++) {
        var temp = {
          projectId: projectSensorDataSplice[index].projectId,
          currentFertility: projectSensorDataSplice[index].soilFertilizer
        };
        showAllFertility.allFertility.push(temp);
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

async function getProjectSensor(greenHouseId) {
  await project_sensor.find(
    { greenHouseId: greenHouseId },
    {},
    { sort: { _id: -1 } },
    (err, projectSensorList) => {
      if (err) {
        console.log("Query fail");
        console.log(err);
      } else {
        console.log("Query pass");
        projectSensorData = projectSensorList;
      }
    }
  );
}
