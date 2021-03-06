const fs = require("fs");
const mongoose = require("mongoose");
const greenHouseSensor = mongoose.model("greenHouse_Sensor");
let ObjectId = require("mongodb").ObjectID;

let greenHouseSensorResult;

export default class ShowTemperatureHistory {
  constructor(req, res) {
    this.process(req, res);
  }

  async process(req, res) {
    console.log("[ShowTemperatureHistory] session id: " + req.session.id);
    if (typeof req.session.farmData === "undefined" || typeof req.session.configFilePath === "undefined") {
      res.sendStatus(401);
      return;
    }
    let greenHouseId = req.body.greenHouseId;
    if (typeof greenHouseId === "undefined") {
      res.json({
        status: 500,
        errorMessage: "เกิดข้อผิดพลาดในการแสดงค่าประวัติอุณหภูมิในอากาศ"
      });
      return;
    }
    console.log("[ShowTemperatureHistory] greenHouseId: " + greenHouseId);
    greenHouseSensorResult = await getGreenHouseSensor(greenHouseId, req);
    if (greenHouseSensorResult.length == 0) {
      console.log("[ShowTemperatureHistory] greenHouseSensorResult undefined");
      res.json({
        status: 500,
        errorMessage: "เกิดข้อผิดพลาดไม่มีข้อมูลประวัติจากเซนเซอร์"
      });
      return;
    }
    let nowDate = new Date();
    let greenHouseSensorDataFlitered = [];
    let compareHours = -1;
    let compareMinutes = -1;
    let compareSeconds = -1;
    for (let index = 0; index < greenHouseSensorResult.length; index++) {
      let indexDateTime = new Date(greenHouseSensorResult[index].timeStamp);
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
          greenHouseSensorResult[index].timeStamp = indexDateTime;
          greenHouseSensorDataFlitered.push(greenHouseSensorResult[index]);
        }
      }
    }
    console.log("[ShowTemperatureHistory] greenHouseSensorDataFlitered.length: " + greenHouseSensorDataFlitered.length);
    if (greenHouseSensorDataFlitered.length == 0) {
      res.json({
        status: 500,
        errorMessage: 'เกิดข้อผิดพลาดไม่มีประวัติอยู่ในระบบ'
      });
      return;
    }
    var temperatureHistory = {
      temperatureHistory: [{
        currentTemperature: greenHouseSensorDataFlitered[0].temperature,
        timeStamp: greenHouseSensorDataFlitered[0].timeStamp
      }]
    };
    for (let index = 1; index < greenHouseSensorDataFlitered.length; index++) {
      var temp = {
        currentTemperature: greenHouseSensorDataFlitered[index].temperature,
        timeStamp: greenHouseSensorDataFlitered[index].timeStamp
      };
      temperatureHistory.temperatureHistory.push(temp);
    }
    res.json(temperatureHistory);
  }
}

async function getGreenHouseSensor(greenHouseId, req) {
  let result = await greenHouseSensor.find({
    _id: {
      $gt: ObjectId.createFromTime(Date.now() / 1000 - 25 * 60 * 60)
    },
    greenHouseId: greenHouseId,
    farmId: req.session.farmId
  });
  if (result) {
    greenHouseSensorResult = result;
  } else {
    greenHouseSensorResult = null;
    console.log("[ShowTemperatureHistory] getGreenHouseSensor, Query fail!");
  }
  return result;
}
