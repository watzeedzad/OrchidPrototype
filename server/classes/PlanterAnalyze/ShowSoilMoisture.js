const mongoose = require("mongoose");
const greenHouseSensor = mongoose.model("greenHouse_Sensor");

let configFile;
let greenHouseSensorData;

export default class ShowSoilMoisture {
  constructor(req, res) {
    this.process(req, res);
  }

  async process(req, res) {
    console.log("[ShowFertilityHistory] session id: " + req.session.id);
    if (typeof req.session.farmData === "undefined" || typeof req.session.configFilePath === "undefined") {
      res.sendStatus(401);
      return;
    }
    await getConfigFile(req, function (config) {
      configFile = config;
    });
    let greenHouseId = req.body.greenHouseId;
    if (typeof req.body.greenHouseId === "undefined") {
      res.json({
        status: 500,
        errorMessage: "เกิดข้อผิดพลาดในการแสดงค่าความชื้นในเครื่องปลูก"
      });
      return;
    }
    console.log("[ShowSoilMoisture] greenHouseId: " + greenHouseId);
    greenHouseSensorData = await getGreenhouseSensor(greenHouseId, req.session.farmId);
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
      let greenHouseIdIndex = await seekGreenHouseIdIndex(configFile.soilMoistureConfigs, greenHouseId);
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

function getConfigFile(req, callback) {
  // console.log("[ShowFertilityHistory] getConfigFilePath: " + req.session.configFilePath);
  let config = JSON.parse(
    require("fs").readFileSync(String(req.session.configFilePath), "utf8")
  );
  // configFile = config;
  callback(config);
}

async function getGreenhouseSensor(greenHouseId, farmId) {
  // let result = await greenHouseSensor.findOne({
  //   greenHouseId: greenHouseId,
  //   farmId: req.session.farmData.farmId
  // }, {}, {
  //   sort: {
  //     _id: -1
  //   }
  // });
  // if (result) {
  //   greenHouseSensorData = result;
  // } else {
  //   greenHouseSensorData = undefined;
  //   console.log("[ShowSoilMoisture] getGreenhouseSensor: Query fail!");
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
      greenHouseSensorData = undefined
      console.log("[ShowSoilMoisture] getGreenhouseSensor (err): " + err);
    } else if (!result) {
      greenHouseSensorData = undefined;
      console.log("[ShowSoilMoisture] getGreenhouseSensor (!result): " + result);
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