const fs = require("fs");
const mongoose = require("mongoose");
const greenHouseSensor = mongoose.model("greenHouse_Sensor");
let ObjectId = require("mongodb").ObjectID;

let greenHouseSensorResult;

export default class ShowSoilMoistureHistory {
  constructor(req, res) {
    this.process(req, res);
  }

  async process(req, res) {
    if (pathGlobal == null) {
      res.sendStatus(500);
    }
    let greenHouseId = req.body.greenHouseId;
    console.log("greenHouseId-ShowAllFertility: " + greenHouseId);
    await getGreenHouseSensor(greenHouseId);
    if (typeof greenHouseSensorResult === "undefined") {
      console.log("greenHouseSensorResult undefined");
      res.sendStatus(500);
    } else {
      let nowDate = new Date();
      let greenHouseSensorDataFlitered = [];
      let compareHours = -1;
      let compareMinutes = -1;
      for (let index = 0; index < greenHouseSensorResult.length; index++) {
        let indexDateTime = new Date(greenHouseSensorResult[index].timeStamp);
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
            greenHouseSensorResult[index].timeStamp = indexDateTime;
            greenHouseSensorDataFlitered.push(greenHouseSensorResult[index]);
          }
        }
      }
      console.log(greenHouseSensorDataFlitered.length);
      var soilMoistureHistory = {
        soilMoistureHistory: [
          {
            currentSoilMoisture: greenHouseSensorDataFlitered[0].soilMoisture,
            timeStamp: greenHouseSensorDataFlitered[0].timeStamp
          }
        ]
      };
      for (
        let index = 1;
        index < greenHouseSensorDataFlitered.length;
        index++
      ) {
        var temp = {
          currentSoilMoisture: greenHouseSensorDataFlitered[index].soilMoisture,
          timeStamp: greenHouseSensorDataFlitered[index].timeStamp
        };
        soilMoistureHistory.soilMoistureHistory.push(temp);
      }
      res.json(soilMoistureHistory);
    }
  }
}

async function getGreenHouseSensor(greenHouseId) {
  let result = await greenHouseSensor.find({
    _id: {
      $gt: ObjectId.createFromTime(Date.now() / 1000 - 48 * 60 * 60)
    },
    greenHouseId: greenHouseId
  });
  if (result) {
    greenHouseSensorResult = result;
  } else {
    greenHouseSensorResult = undefined;
    console.log("Query fail!");
  }
}
