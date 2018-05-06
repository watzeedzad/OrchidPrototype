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
      for (let index = 0; index < projectSensorResult.length; index++) {
        let indexDateTime = new Date(projectSensorResult[index].timeStamp);
        if (
          indexDateTime.getDate() == nowDate.getDate() &&
          indexDateTime.getMinutes() < 10
        ) {
          if (compareHours == -1 && compareMinutes == -1) {
            compareHours = indexDateTime.getHours();
            compareMinutes = indexDateTime.getMinutes();
          } else if (compareHours < indexDateTime.getHours()) {
            compareHours = -1;
            compareMinutes = -1;
          }
          if (
            compareHours == indexDateTime.getHours() &&
            compareMinutes == indexDateTime.getMinutes()
          ) {
            indexDateTime.setHours(indexDateTime.getHours() + 7);
            projectSensorResult[index].timeStamp = indexDateTime;
            projectSensorDataSplice.push(projectSensorResult[index]);
          }
        }
      }
      console.log(projectSensorDataSplice.length);
      var fertilityHistory = {
        fertilityHistory: [
          {
            currentFertility: projectSensorDataSplice[0].soilFertilizer,
            timeStamp: projectSensorDataSplice[0].timeStamp
          }
        ]
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
  await project_sensor.find(
    {
      _id: {
        $gt: ObjectId.createFromTime(Date.now() / 1000 - 26 * 60 * 60)
      },
      projectId: projectId
    },
    (err, projectSensorList) => {
      if (err) {
        console.log("Query fail");
        console.log(err);
      } else {
        console.log("Query pass");
        projectSensorResult = projectSensorList;
        console.log(projectSensorList);
      }
    }
  );
}
