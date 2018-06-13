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
    let projectId = req.body.projectId;
    if (typeof projectId === "undefined") {
      res.json({
        status: 500,
        message: "เกิดข้อผิดพลาดในการแสดงค่าความอุดมสมบูรณ์ในเครื่องปลูก"
      });
    } else {
      console.log("[ShowFertility] projectId: " + projectId);
      await getProjectSensor(projectId);
      await getConfigFile();
      let projectIdIndex = await seekProjectIdIndex(
        configFile.fertilityConfigs,
        projectId
      );
      if (typeof projectSensorData === "undefined") {
        res.sendStatus(500);
      } else if (typeof configFile === "undefined") {
        res.sendStatus(500);
      } else if (projectIdIndex == -1) {
        res.sendStatus(500);
      } else {
        let minConfigFertility =
          configFile.fertilityConfigs[projectIdIndex].minFertility;
        let maxConfigFertility =
          configFile.fertilityConfigs[projectIdIndex].maxFertility;
        let cuurentFertility = projectSensorData.soilFertilizer;
        var showFertility = {
          projectId: projectId,
          minConfigFertility: minConfigFertility,
          maxConfigFertility: maxConfigFertility,
          currentFertility: cuurentFertility
        };
        res.json(showFertility);
      }
    }
  }
}
async function getConfigFile() {
  console.log("[ShowFertility] getConfigFilePath: " + pathGlobal);
  let config = JSON.parse(
    require("fs").readFileSync(String(pathGlobal), "utf8")
  );
  configFile = config;
}

async function getProjectSensor(projectId) {
  let result = await project_sensor.findOne({
      projectId: projectId
    }, {}, {
      sort: {
        _id: -1
      }
    },
    function (err, result) {
      if (err) {
        console.log("[ShowFertility] ProjectSensor Query Failed!");
        projectSensorData = undefined;
      } else {
        projectSensorData = result;
      }
    }
  );
}

function seekProjectIdIndex(dataArray, projectId) {
  console.log(dataArray);
  let index = dataArray.findIndex(function (item, i) {
    return item.projectId === projectId;
  });
  return index;
}