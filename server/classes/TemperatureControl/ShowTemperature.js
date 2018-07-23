const mongoose = require("mongoose");
const fs = require("fs");
const greenHouseSensor = mongoose.model("greenHouse_Sensor");

let configFile;
let greenHouseSensorData;

export default class ShowTemprature {
  constructor(req, res) {
    this.process(req, res);
  }

  async process(req, res) {
    if (typeof req.session.farmData === "undefined" || typeof req.session.configFilePath === "undefined") {
      res.sendStatus(500);
      return;
    }
    console.log("[ShowTemperature] session id: " + req.session.id);
    // req.session.reload(function (err) {
    //   console.log("[ShowTemperature] " + err);
    // });
    configFile = req.session.configFile;
    let greenHouseId = req.body.greenHouseId;
    if (typeof greenHouseId === "undefined") {
      res.json({
        status: 500,
        errorMessage: "เกิดข้อผิดพลาดในการแสดงค่าอุณหภูมิในอากาศ"
      });
      return;
    }
    console.log("[ShowTemperature] greenHouseId: " + greenHouseId);
    await getGreenhouseSensor(greenHouseId, req.session.farmId);
    // await getConfigFile(req);
    if (typeof greenHouseSensorData === "undefined" || greenHouseSensorData == null) {
      res.json({
        status: 500,
        errorMessage: "เกิดข้อผิดพลาดไม่มีข้อมูลจากเซนเซอร์ของโรงเรือน"
      });
    } else if (typeof configFile === "undefined") {
      res.json({
        status: 500,
        errorMessage: "เกิดข้อผิดพลาดไม่สามารถอ่านไฟล์การตั้งค่าได้"
      });
    } else {
      let greenHouseIdIndex = await seekGreenHouseIdIndex(configFile.temperatureConfigs, greenHouseId);
      if (greenHouseIdIndex == -1) {
        res.json({
          status: 500,
          errorMessage: "เกิดข้อผิดพลาดในการแสดงค่าอุณหภูมิในอากาศ"
        });
        return;
      }
      let minConfigTemp = configFile.temperatureConfigs[greenHouseIdIndex].minTemperature;
      let maxConfigTemp = configFile.temperatureConfigs[greenHouseIdIndex].maxTemperature;
      let currentTemp = greenHouseSensorData.temperature;
      var showTemp = {
        minConfigTemperature: minConfigTemp,
        maxConfigTemperature: maxConfigTemp,
        currentTemperature: currentTemp
      };
      res.json(showTemp);
    }
  }
}

async function getGreenhouseSensor(greenHouseId, farmId) {
  // let result = await greenHouseSensor.findOne({
  //   greenHouseId: greenHouseId,
  //   farmId: req.session.farmId
  // });
  // if (result) {
  //   greenHouseSensorData = result;
  // } else {
  //   greenHouseSensorData = undefined;
  //   console.log("Query fail!");
  // }
  await greenHouseSensor.findOne({
    greenHouseId: greenHouseId,
    farmId: farmId
  }, null, {
    sort: {
      _id: -1
    }
  }, (err, result) => {
    if (err) {
      greenHouseSensorData = undefined
      console.log("[ShowTemperature] getGreenhouseSensor (err): " + err);
    } else if (!result) {
      greenHouseSensorData = undefined;
      console.log("[ShowTemperature] getGreenhouseSensor (!result): " + result);
    } else {
      greenHouseSensorData = result;
    }
  });
}

function seekGreenHouseIdIndex(dataArray, greenHouseId) {
  let index = dataArray.findIndex(function (item, i) {
    return item.greenHouseId === greenHouseId;
  });
  return index;
}