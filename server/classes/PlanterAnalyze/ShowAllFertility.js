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
    console.log("[ShowAllFertility] session id: " + req.session.id);
    if (typeof req.session.farmData === "undefined" || typeof req.session.configFilePath === "undefined") {
      res.sendStatus(401);
      return;
    }
    await getConfigFile(req, function (config) {
      configFile = config;
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
    // await getConfigFile(req);
    projectSensorData = await getProjectSensor(greenHouseId, req.session.farmId);
    if (projectSensorData.length == 0) {
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
          currentFertility: projectSensorDataSplice[index].soilFertility
        };
        showAllFertility.allFertility.push(temp);
      }
      showAllFertility.allFertility.sort();
      res.json(showAllFertility);
    }
  }
}

function getConfigFile(req, callback) {
  // console.log("[ShowAllFertility] getConfigFilePath: " + req.session.configFilePath);
  let config = JSON.parse(
    require("fs").readFileSync(String(req.session.configFilePath), "utf8")
  );
  // configFile = config;
  callback(config);
}

async function getProjectSensor(greenHouseId, farmId) {
  let result = await project_sensor.find({
    greenHouseId: greenHouseId,
    farmId: farmId
  }, {}, {
    sort: {
      _id: -1
    }
  });
  if (result) {
    projectSensorData = result;
  } else {
    projectSensorData = null;
    console.log("[ShowAllFertility] getProjectSensor: Query fail!");
  }
  return result;
}

function seekProjectIdIndex(dataArray, projectId) {
  let index = dataArray.findIndex(function (item, i) {
    return item.projectId === projectId;
  });
  return index;
}