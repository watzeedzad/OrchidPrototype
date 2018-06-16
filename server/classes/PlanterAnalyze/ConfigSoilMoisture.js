const fs = require("fs");

let configFile;

export default class ConfigSoilMoisture {
  constructor(req, res) {
    this.process(req, res);
  }

  async process(req, res) {
    await getConfigFile();
    if (typeof configFile === "undefined") {
      res.json({
        status: 500,
        errorMessage: "เกิดข้อผิดพลาดไม่สามารถอ่านไฟล์การตั้งค่าได้"
      });
      return;
    }
    if (typeof req.body.minSoilMoisture === "undefined" || typeof req.body.maxSoilMoisture === "undefined" || typeof req.body.greenHouseId === "undefined") {
      res.json({
        status: 500,
        errorMessage: "เกิดข้อผิดพลาดในการตั้งค่าความชื้นในเครื่องปลูก"
      });
      return;
    }
    let maxConfigSoilMois = parseFloat(req.body.maxSoilMoisture);
    console.log("[ConfigSoilMoisture] maxConfigSoilMois: " + maxConfigSoilMois);
    let minConfigSoilMois = parseFloat(req.body.minSoilMoisture);
    console.log("[ConfigSoilMoisture] minConfigSoilMois: " + minConfigSoilMois);
    let greenHouseId = req.body.greenHouseId;
    console.log("[ConfigSoilMoisture] greenHouseId: " + greenHouseId);
    let greenHouseConfigIndex = await seekGreenHouseIdIndex(configFile.soilMoistureConfigs, greenHouseId);
    if (greenHouseConfigIndex == -1) {
      res.json({
        status: 500,
        errorMessage: "เกิดข้อผิดพลาดในการตั้งค่าความชื้นในเครื่องปลูก"
      });
      return;
    }
    if (minConfigSoilMois > maxConfigSoilMois) {
      res.json({
        status: 500,
        errorMessage: "เกิดข้อผิดพลาดในการเขียนไฟล์การตั้งค่า"
      });
      return;
    }
    let updateData = {
      greenHouseId: greenHouseId,
      minSoilMoisture: minConfigSoilMois,
      maxSoilMoisture: maxConfigSoilMois
    }
    configFile.soilMoistureConfigs[greenHouseConfigIndex] = updateData;
    await writeConfigFile(configFile, res);
  }
}

function getConfigFile() {
  console.log("[ConfigSoilMoisture] getConfigFilePath: " + pathGlobal);
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
    console.log("[ConfigSoilMoisture] write file with no error");
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

function seekGreenHouseIdIndex(dataArray, greenHouseId) {
  let index = dataArray.findIndex(function (item, i) {
    return item.greenHouseId === greenHouseId;
  });
  return index;
}