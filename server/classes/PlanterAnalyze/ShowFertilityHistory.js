const fs = require("fs");
const mongoose = require("mongoose");
const project_sensor = mongoose.model("project_Sensor");
let ObjectId = require("mongodb").ObjectID;

let projectSensorResult;

export default class ShowFertilityHistory {
  constructor(req, res) {
    this.process(req, res);
  }

  async process(req, res) {
    let projectId = req.body.projectId;
    if (typeof projectId === "undefined") {
      res.json({
        status: 500,
        message: "เกิดข้อผิดพลาดในการแสดงค่าประวัติความอุดมสมบูรณ์ในเครื่องปลูก"
      });
      return;
    }
    console.log("[ShowFertilityHistory] projectId: " + projectId);
    await getProjectSensor(projectId);
    if (typeof projectSensorResult === "undefined") {
      console.log("[ShowFertilityHistory] projectSensorResult undefined");
      res.json({
        status: 500,
        message: "เกิดข้อผิดพลาดไม่มีข้อมูลประวัติจากเซนเซอร์"
      })
      return;
    }
    let nowDate = new Date();
    let projectSensorDataSplice = [];
    let compareHours = -1;
    let compareMinutes = -1;
    let compareSeconds = -1;
    for (let index = 0; index < projectSensorResult.length; index++) {
      let indexDateTime = new Date(projectSensorResult[index].timeStamp);
      if (
        indexDateTime.getDate() == nowDate.getDate() &&
        indexDateTime.getMinutes() < 10
      ) {
        if (compareHours == -1 && compareMinutes == -1 && compareSeconds == -1) {
          compareHours = indexDateTime.getHours();
          compareMinutes = indexDateTime.getMinutes();
          compareSeconds = indexDateTime.getSeconds();
        } else if (compareHours < indexDateTime.getHours()) {
          compareHours = -1;
          compareMinutes = -1;
          compareSeconds = -1;
        }
        if (
          compareHours == indexDateTime.getHours() &&
          compareMinutes == indexDateTime.getMinutes() &&
          compareSeconds == indexDateTime.getSeconds()
        ) {
          indexDateTime.setHours(indexDateTime.getHours() + 7);
          projectSensorResult[index].timeStamp = indexDateTime;
          projectSensorDataSplice.push(projectSensorResult[index]);
        }
      }
    }
    console.log("[ShowFertilityHistory] projectSensorDataSplice.length: " + projectSensorDataSplice.length);
    if (projectSensorDataSplice.length == 0) {
      res.json({
        status: 500,
        message: 'เกิดข้อผิดพลาดไม่มีประวัติอยู่ในระบบ'
      });
      return;
    }
    var fertilityHistory = {
      fertilityHistory: [{
        currentFertility: projectSensorDataSplice[0].soilFertilizer,
        timeStamp: projectSensorDataSplice[0].timeStamp
      }]
    };
    for (let index = 1; index < projectSensorDataSplice.length; index++) {
      var temp = {
        currentFertility: projectSensorDataSplice[index].soilFertilizer,
        timeStamp: projectSensorDataSplice[index].timeStamp
      };
      fertilityHistory.fertilityHistory.push(temp);
    }
    res.json(fertilityHistory);
  }
}

async function getProjectSensor(projectId) {
  let result = await project_sensor.find({
    _id: {
      $gt: ObjectId.createFromTime(Date.now() / 1000 - 25 * 60 * 60)
    },
    projectId: projectId
  });
  if (result) {
    projectSensorResult = result;
  } else {
    projectSensorResult = undefined;
    console.log("[ShowFertilityHistory] getProjectSensor: Query fail!");
  }
}