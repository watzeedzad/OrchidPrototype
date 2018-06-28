const fs = require("fs");

let configFile;
let existGreenHouseIndex;
let writeFileStatus;

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
        errorMessage: "เกิดข้อผิดพลาดในการตั้งค่าการให้น้ำอัตโนมัติ"
      });
    }
    console.log("[WateringConfigs] greenHouseId: " + greenHouseId);
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
        } else {
          existGreenHouseIndex = -1;
        }
      }
    }
    for (let index = 0; index < configTimeRanges.length; index++) {
      let tempDate = new Date(configTimeRanges[index]);
      console.log("[WateringConfigs] configTimeRanges" + "[" + index + "]: " + configTimeRanges[index]);
      let tempTimeMills = tempDate.getTime();
      tempJson.timeRanges.push(tempTimeMills);
    }
    console.log("[WateringConfigs] existGreenHouseIndex: " + existGreenHouseIndex);
    if (existGreenHouseIndex == -1) {
      res.json({
        status: 500,
        errorMessage: "ไม่สามารถตั้งค่าการให้น้ำของโรงเรือนที่ระบุได้",
      });
      return;
    }
    configFile.watering[existGreenHouseIndex] = tempJson;
    await writeConfigFile(configFile);
    if (writeFileStatus) {
      res.sendStatus(200);
    } else {
      res.json({
        status: 500,
        errorMessage: "เกิดข้อผิดพลาดไม่สามารถเขียนไฟล์การตั้งค่าได้"
      });
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

function writeConfigFile(configFile, res) {
  let content = JSON.stringify(configFile);
  fs.writeFile(String(pathGlobal), content, "utf8", function (err) {
    if (err) {
      console.log(err);
      writeFileStatus = false;
      return;
    }
  });
  writeFileStatus = true;
  console.log("[WateringConfig] write file with no error");
}