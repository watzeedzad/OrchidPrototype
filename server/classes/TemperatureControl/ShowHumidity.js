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
    let greenHouseId = req.body.greenHouseId;
    if (typeof greenHouseId === "undefined") {
      res.json({
        status: 500,
        errorMessage: "เกิดข้อผิดพลาดในการแสดงค่าความชื้นในอากาศ"
      });
      return;
    }
    console.log("[ShowHumidity] greenHouseId: " + greenHouseId);
    await getGreenhouseSensor(greenHouseId);
    await getConfigFile();
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

async function getConfigFile() {
  console.log("getConfigFilePath: " + pathGlobal);
  let config = JSON.parse(
    require("fs").readFileSync(String(pathGlobal), "utf8")
  );
  configFile = config;
}

async function getGreenhouseSensor(greenHouseId) {
  let result = await greenHouseSensor.findOne({
    greenHouseId: greenHouseId
  }, {}, {
    sort: {
      _id: -1
    }
  });
  if (result) {
    greenHouseSensorData = result;
  } else {
    greenHouseSensorData = undefined;
    console.log("Query fail!");
  }
  console.log(greenHouseSensorData);
}

function seekGreenHouseIdIndex(dataArray, greenHouseId) {
  console.log(dataArray);
  let index = dataArray.findIndex(function (item, i) {
    return item.greenHouseId === greenHouseId;
  });
  return index;
}