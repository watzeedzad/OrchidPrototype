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
    console.log("[ShowFertility] session id: " + req.session.id);
    if (typeof req.session.farmData === "undefined" || typeof req.session.configFilePath === "undefined") {
      res.sendStatus(401);
      return;
    }
    await getConfigFile(req, function (config) {
      configFile = config;
    });
    let projectId = req.body.projectId;
    if (typeof projectId === "undefined") {
      res.json({
        status: 500,
        message: "เกิดข้อผิดพลาดในการแสดงค่าความอุดมสมบูรณ์ในเครื่องปลูก"
      });
      return;
    }
    console.log("[ShowFertility] projectId: " + projectId);
    projectSensorData = await getProjectSensor(projectId, req.session.farmId);
    let projectIdIndex = await seekProjectIdIndex(
      configFile.fertilityConfigs,
      projectId
    );
    if (projectSensorData == null) {
      res.json({
        status: 500,
        message: "เกิดข้อผิดพลาดไม่มีข้อมูลจากเซนเซอร์ของโปรเจค"
      });
    } else if (typeof configFile === "undefined") {
      res.json({
        status: 500,
        message: "เกิดข้อผิดพลาดไม่สามารถอ่านไฟล์การตั้งค่าได้"
      });
    } else if (projectIdIndex == -1) {
      res.json({
        status: 500,
        message: "เกิดข้อผิดพลาดในการแสดงค่าความอุดมสมบูรณ์ในเครื่องปลูก"
      });
    } else {
      let minConfigFertility =
        configFile.fertilityConfigs[projectIdIndex].minFertility;
      let maxConfigFertility =
        configFile.fertilityConfigs[projectIdIndex].maxFertility;
      let cuurentFertility = projectSensorData.soilFertility;
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

function getConfigFile(req, callback) {
  // console.log("[ShowFertility] getConfigFilePath: " + req.session.configFilePath);
  let config = JSON.parse(
    require("fs").readFileSync(String(req.session.configFilePath), "utf8")
  );
  // configFile = config;
  callback(config);
}

async function getProjectSensor(projectId, farmId) {
  let result = await project_sensor.findOne({
      projectId: projectId,
      farmId: farmId
    }, {}, {
      sort: {
        _id: -1
      }
    },
    function (err, result) {
      if (err) {
        console.log("[ShowFertility] ProjectSensor Query Failed!");
        projectSensorData = null;
      } else {
        projectSensorData = result;
      }
    }
  );
  return result;
}

function seekProjectIdIndex(dataArray, projectId) {
  console.log(dataArray);
  let index = dataArray.findIndex(function (item, i) {
    return item.projectId === projectId;
  });
  return index;
}