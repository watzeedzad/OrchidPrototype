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
    console.log("[ShowTemperature] session id: " + req.session.id);
    if (typeof req.session.farmData === "undefined" || typeof req.session.configFilePath === "undefined") {
      res.sendStatus(401);
      return;
    }
    await getConfigFile(req, function (config) {
      configFile = config;
    });
    let greenHouseId = req.body.greenHouseId;
    if (typeof greenHouseId === "undefined") {
      res.json({
        status: 500,
        errorMessage: "เกิดข้อผิดพลาดในการแสดงค่าอุณหภูมิในอากาศ"
      });
      return;
    }
    console.log("[ShowTemperature] greenHouseId: " + greenHouseId);
    greenHouseSensorData = await getGreenhouseSensor(greenHouseId, req.session.farmId);
    // await getConfigFile(req);
    if (greenHouseSensorData == null) {
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

function getConfigFile(req, callback) {
  // console.log("[ShowTemperature] getConfigFilePath: " + req.session.configFilePath);
  let config = JSON.parse(
    require("fs").readFileSync(String(req.session.configFilePath), "utf8")
  );
  // configFile = config;
  callback(config);
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
  let result = await greenHouseSensor.findOne({
    greenHouseId: greenHouseId,
    farmId: farmId
  }, null, {
    sort: {
      _id: -1
    }
  }, (err, result) => {
    if (err) {
      greenHouseSensorData = null
      console.log("[ShowTemperature] getGreenhouseSensor (err): " + err);
    } else if (!result) {
      greenHouseSensorData = null;
      console.log("[ShowTemperature] getGreenhouseSensor (!result): " + result);
    } else {
      greenHouseSensorData = result;
    }
  });
  return result;
}

function seekGreenHouseIdIndex(dataArray, greenHouseId) {
  let index = dataArray.findIndex(function (item, i) {
    return item.greenHouseId === greenHouseId;
  });
  return index;
}