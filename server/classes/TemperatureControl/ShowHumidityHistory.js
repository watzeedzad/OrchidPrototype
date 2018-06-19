const fs = require("fs");
const mongoose = require("mongoose");
const greenHouseSensor = mongoose.model("greenHouse_Sensor");
let ObjectId = require("mongodb").ObjectID;

let greenHouseSensorResult;

export default class ShowHumidityHistory {
  constructor(req, res) {
    this.process(req, res);
  }

  async process(req, res) {
    let greenHouseId = req.body.greenHouseId;
    if (typeof greenHouseId === "undefined") {
      res.json({
        status: 500,
        errorMessage: "เกิดข้อผิดพลาดในการแสดงค่าประวัติความชื้นในอากาศ"
      });
      return;
    }
    console.log("[ShowHumidityHistory] greenHouseId: " + greenHouseId);
    await getGreenHouseSensor(greenHouseId);
    if (typeof greenHouseSensorResult === "undefined") {
      console.log("[ShowHumidityHistory] greenHouseSensorResult undefined");
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
    console.log("[ShowHumidityHistory] greenHouseSensorDataFlitered.length: " + greenHouseSensorDataFlitered.length);
    if (greenHouseSensorDataFlitered.length == 0) {
      res.json({
        status: 500,
        message: 'เกิดข้อผิดพลาดไม่มีประวัติอยู่ในระบบ'
      });
      return;
    }
    var humidityHistory = {
      humidityHistory: [{
        currentHumidity: greenHouseSensorDataFlitered[0].humidity,
        timeStamp: greenHouseSensorDataFlitered[0].timeStamp
      }]
    };
    for (
      let index = 1; index < greenHouseSensorDataFlitered.length; index++
    ) {
      var temp = {
        currentHumidity: greenHouseSensorDataFlitered[index].humidity,
        timeStamp: greenHouseSensorDataFlitered[index].timeStamp
      };
      humidityHistory.humidityHistory.push(temp);
    }
    res.json(humidityHistory);
  }
}

async function getGreenHouseSensor(greenHouseId) {
  let result = await greenHouseSensor.find({
    _id: {
      $gt: ObjectId.createFromTime(Date.now() / 1000 - 25 * 60 * 60)
    },
    greenHouseId: greenHouseId
  });
  if (result) {
    greenHouseSensorResult = result;
  } else {
    greenHouseSensorResult = undefined;
    console.log("[ShowHumidityHistory] getGreenHouseSensor, Query fail!");
  }
}