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
    if (pathGlobal == null) {
      res.sendStatus(500);
    }
    let projectId = req.body.projectId;
    console.log("projectId-ShowAllFertility: " + projectId);
    await getProjectSensor(projectId);
    if (typeof projectSensorResult === "undefined") {
      console.log("projectSensorResult undefined");
      res.sendStatus(500);
    } else {
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
      console.log(projectSensorDataSplice.length);
      if (projectSensorDataSplice.length == 0) {
        res.json({
          status: 500,
          message: 'ไม่มีประวัติอยู่ในระบบ'
        })
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
    console.log("Query fail!");
  }
}