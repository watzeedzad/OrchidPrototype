const fs = require("fs");

let configFile;
let existGreenHouseIndex;

export default class WateringConfig {
  constructor(req, res) {
    this.process(req, res);
  }

  async process(req, res) {
    let greenHouseId = req.body.greenHouseId;
    let configTimeRanges = req.body.timeRanges;
    if (
      typeof greenHouseId === "undefined" ||
      typeof configTimeRanges === "undefined"
    ) {
      res.json({
        status: 500,
        message: "เกิดข้อผิดพลาดในการตั้งค่าการให้น้ำ"
      });
    } else {
      getConfigFile();
      let tempJson = {
        greenHouseId: greenHouseId,
        timeRanges: []
      };
      let wateringConfig = configFile.watering;
      let tempArray = [];
      if (!Object.keys(wateringConfig).length == 0) {
        for (let index = 0; index < Object.keys(wateringConfig).length; index++) {
          let temp = wateringConfig[index];
          if (temp.greenHouseId == greenHouseId) {
            existGreenHouseIndex = index;
          }
        }
      }
      for (let index = 0; index < configTimeRanges.length; index++) {
        let tempDate = configTimeRanges[index];
        let tempTimeMills = tempDate.getTime();
        tempJson.timeRanges.push(tempTimeMills);
      }
      if (Object.keys(wateringConfig).length == 0) {
        configFile.watering.push(tempJson);
        writeConfigFile(configFile);
        res.sendStatus(200);
      } else if (typeof existGreenHouseIndex === "undefined") {
        res.json({
          status: 200,
          message: "ไม่สามารถตั้งค่าการให้น้ำของโรงเรือนที่ระบุได้",
          status: false
        });
      } else {
        configFile.watering[existGreenHouseIndex] = tempJson;
        writeConfigFile(configFile);
        res.sendStatus(200);
      }
    }
  }
}

async function getConfigFile() {
  console.log("[WateringConfig] getConfigFilePath, " + pathGlobal);
  let config = JSON.parse(
    require("fs").readFileSync(String(pathGlobal), "utf8")
  );
  configFile = config;
}

async function writeConfigFile(configFile) {
  let content = JSON.stringify(configFile);
  fs.writeFileSync(String(pathGlobal), content, "utf8", function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log("[WateringConfig] writeConfigFile, write with no error");
    }
  });
}