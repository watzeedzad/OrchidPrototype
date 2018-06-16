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
        errorMessage:"เกิดข้อผิดพลาดในการตั้งค่าการให้น้ำอัตโนมัติ"
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
      if (typeof existGreenHouseIndex === "undefined") {
        res.json({
          status: 500,
          errorMessage:"ไม่สามารถตั้งค่าการให้น้ำของโรงเรือนที่ระบุได้",
        });
      } else {
        configFile.watering[existGreenHouseIndex] = tempJson;
        writeConfigFile(configFile, res);
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

function writeConfigFile(configFile, res) {
  let writeFileResult;
  let content = JSON.stringify(configFile);
  fs.writeFile(String(pathGlobal), content, "utf8", function (err) {
    if (err) {
      console.log(err);
      writeFileResult = false;
    }
    writeFileResult = true;
    console.log("[WateringConfig] write file with no error");
    if (writeFileResult) {
      res.sendStatus(200);
    } else {
      res.json({
        status: 500,
        errorMessage: "เกิดข้อผิดพลาดไม่สามารถเขียนไฟล์การตั้งค่าได้"
      });
    }
  });
}
