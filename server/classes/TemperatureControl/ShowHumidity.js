const mongoose = require("mongoose");
const fs = require("fs");
const greenHouseSensor = mongoose.model("greenHouse_Sensor");

let configFile;
let greenHouseSensorData;

export default class ShowHumidity {
  constructor(req, res) {
    this.process(req, res);
  }

  async process(req, res) {
    if (typeof req.session.farmData === "undefined" || typeof req.session.configFilePath === "undefined") {
      res.sendStatus(500);
      return;
    }
    console.log("[ShowHumidity] session id: " + req.session.id);
    // req.session.reload(function (err) {
    //   console.log("[ShowHumidity] " + err);
    // });
    configFile = req.session.configFile;
    let greenHouseId = req.body.greenHouseId;
    if (typeof greenHouseId === "undefined") {
      res.json({
        status: 500,
        errorMessage: "เกิดข้อผิดพลาดในการแสดงค่าความชื้นในอากาศ"
      });
      return;
    }
    console.log("[ShowHumidity] greenHouseId: " + greenHouseId);
    await getGreenhouseSensor(greenHouseId, req.session.farmId);
    if (typeof greenHouseSensorData === "undefined") {
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
      let greenHouseIdIndex = await seekGreenHouseIdIndex(configFile.humidityConfigs, greenHouseId);
      if (greenHouseIdIndex == -1) {
        res.json({
          status: 500,
          errorMessage: "เกิดข้อผิดพลาดในการแสดงค่าความชื้นในอากาศ"
        });
        return;
      }
      let minConfigHumid = configFile.humidityConfigs[greenHouseIdIndex].minHumidity;
      let maxConfigHumid = configFile.humidityConfigs[greenHouseIdIndex].maxHumidity;
      let currentHumid = greenHouseSensorData.humidity;
      var showTemp = {
        minConfigHumidity: minConfigHumid,
        maxConfigHumidity: maxConfigHumid,
        currentHumidity: currentHumid
      };
      res.json(showTemp);
    }
  }
}

async function getGreenhouseSensor(greenHouseId, farmId) {
  // let result = await greenHouseSensor.findOne({
  //   greenHouseId: greenHouseId
  // }, {}, {
  //   sort: {
  //     _id: -1
  //   }
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
      console.log("[ShowHumidity] getGreenhouseSensor (err): " + err);
    } else if (!result) {
      greenHouseSensorData = undefined;
      console.log("[ShowHumidity] getGreenhouseSensor (!result): " + result);
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