const fs = require("fs");
const mongoose = require("mongoose");
const project_sensor = mongoose.model("project_Sensor");
const session = require("express-session");

let configFile;
let projectSensorData;

export default class ShowAllFertility {
  constructor(req, res) {
    this.process(req, res);
  }

  async process(req, res) {
    if (typeof req.session.farmData === "undefined" || typeof req.session.configFilePath === "undefined") {
      res.sendStatus(500);
      return;
    }
    console.log("[ShowAllFertility] session id: " + req.session.id);
    req.session.reload(function (err) {
      console.log("[ShowAllFertility] " + err);
    });
    if (typeof req.body.greenHouseId === "undefined") {
      res.json({
        status: 500,
        message: "เกิดข้อผิดพลาดในการแสดงค่าความอุดมสมบูรณ์ในเครื่องปลูกทั้งหมด"
      });
      return;
    }
    let greenHouseId = parseInt(req.body.greenHouseId);
    console.log("[ShowAllFertility] greenHouseId: " + greenHouseId);
    await getConfigFile(req);
    await getProjectSensor(greenHouseId);
    if (typeof projectSensorData === "undefined") {
      console.log("[ShowAllFertility] projectSensorResult undefined");
      res.json({
        status: 500,
        message: "เกิดข้อผิดพลาดไม่มีข้อมูลจากเซนเซอร์ของโปรเจค"
      });
    } else if (typeof configFile === "undefined") {
      console.log("[ShowAllFertility] configFile undefined");
      res.json({
        status: 500,
        message: "เกิดข้อผิดพลาดไม่สามารถอ่านไฟล์การตั้งค่าได้"
      });
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

function getConfigFile(req) {
  console.log("[ShowAllFertility] getConfigFilePath: " + req.session.configFilePath);
  let config = JSON.parse(
    require("fs").readFileSync(String(req.session.configFilePath), "utf8")
  );
  configFile = config;
}

async function getProjectSensor(greenHouseId) {
  let result = await project_sensor.find({
    greenHouseId: greenHouseId,
    farmId: req.session.farmData.farmId
  }, {}, {
    sort: {
      _id: -1
    }
  });
  if (result) {
    projectSensorData = result;
  } else {
    projectSensorData = undefined;
    console.log("[ShowAllFertility] getProjectSensor: Query fail!");
  }
}

function seekProjectIdIndex(dataArray, projectId) {
  let index = dataArray.findIndex(function (item, i) {
    return item.projectId === projectId;
  });
  return index;
}