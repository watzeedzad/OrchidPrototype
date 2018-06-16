const mongoose = require("mongoose");
const fs = require("fs");
const greenHouseSensor = mongoose.model("greenHouse_Sensor");

let configFile;
let greenHouseSensorData;

export default class ShowSoilMoisture {
  constructor(req, res) {
    this.process(req, res);
  }

  async process(req, res) {
    let greenHouseId = req.body.greenHouseId;
    if (typeof req.body.greenHouseId === "undefined") {
      res.json({
        status: 500,
        errorMessage: "เกิดข้อผิดพลาดในการแสดงค่าความชื้นในเครื่องปลูก"
      });
      return;
    }
    console.log("[ShowSoilMoisture] greenHouseId: " + greenHouseId);
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
      let greenHouseIdIndex = await seekGreenHouseIdIndex(config.soilMoistureConfigs, greenHouseId);
      if (greenHouseIdIndex == -1) {
        res.json({
          status: 500,
          errorMessage: "เกิดข้อผิดพลาดในการแสดงค่าความชื้นในเครื่องปลูก"
        });
        return;
      }
      let minConfigSoilMois = configFile.soilMoistureConfigs[greenHouseIdIndex].minSoilMoisture;
      let maxConfigSoilMois = configFile.soilMoistureConfigs[greenHouseIdIndex].maxSoilMoisture;
      let currentSoilMoisture = greenHouseSensorData.soilMoisture;
      var showSoilMoisture = {
        minConfigSoilMoisture: minConfigSoilMois,
        maxConfigSoilMoisture: maxConfigSoilMois,
        currentSoilMoisture: currentSoilMoisture
      };
      res.json(showSoilMoisture);
    }
  }
}

function getConfigFile() {
  console.log("[ShowSoilMoisture] getConfigFilePath: " + pathGlobal);
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
    console.log("[ShowSoilMoisture] getGreenhouseSensor: Query fail!");
  }
}

function seekGreenHouseIdIndex(dataArray, greenHouseId) {
  console.log(dataArray);
  let index = dataArray.findIndex(function (item, i) {
    return item.greenHouseId === greenHouseId;
  });
  return index;
}