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
      res.json({
        status: 500,
        message: "เกิดข้อผิดพลาดไม่ได้ login"
      });
    } else {
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
      } else {
        let countProjectId = [];
        let projectSensorDataSplice = [];
        for (let index = 0; index < projectSensorData.length; index++) {
          if (!countProjectId.includes(projectSensorData[index].projectId)) {
            projectSensorDataSplice.push(projectSensorData[index]);
            countProjectId.push(projectSensorData[index].projectId);
          }
        }
        var showAllFertility = {
          allFertility: []
        };
        for (let index = 0; index < projectSensorDataSplice.length; index++) {
          let projectConfigIndex = seekProjectIdIndex(
            configFile.fertilityConfigs,
            projectSensorDataSplice[index].projectId
          );
          if (projectConfigIndex == -1) {
            continue;
          }
          var temp = {
            projectId: projectSensorDataSplice[index].projectId,
            minFertility: configFile.fertilityConfigs[projectConfigIndex].minFertility,
            maxFertility: configFile.fertilityConfigs[projectConfigIndex].maxFertility,
            currentFertility: projectSensorDataSplice[index].soilFertilizer
          };
          showAllFertility.allFertility.push(temp);
        }
        showAllFertility.allFertility.sort();
        res.json(showAllFertility);
      }
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
  let result = await project_sensor.find({
    greenHouseId: greenHouseId
  }, {}, {
    sort: {
      _id: -1
    }
  });
  if (result) {
    projectSensorData = result;
  } else {
    projectSensorData = undefined;
    console.log("Query fail!");
  }
}

function seekProjectIdIndex(dataArray, projectId) {
  console.log(dataArray);
  let index = dataArray.findIndex(function (item, i) {
    return item.projectId === projectId;
  });

  return index;
}