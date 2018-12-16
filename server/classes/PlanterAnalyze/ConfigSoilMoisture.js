let fs = require("fs");

let configFile;
let writeFileStatus;

export default class ConfigSoilMoisture {
  constructor(req, res) {
    this.process(req, res);
  }

  async process(req, res) {
    console.log("[ConfigSoilMoisture] session id: " + req.session.id);
    if (typeof req.session.farmData === "undefined" || typeof req.session.configFilePath === "undefined") {
      res.sendStatus(401);
      return;
    }
    await getConfigFile(req, function (config) {
      configFile = config;
    });
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
    await writeConfigFile(configFile, req.session.configFilePath);
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

function getConfigFile(req, callback) {
  // console.log("[ConfigSoilMoisture] getConfigFilePath: " + req.session.configFilePath);
  let config = JSON.parse(
    require("fs").readFileSync(String(req.session.configFilePath), "utf8")
  );
  // configFile = config;
  callback(config);
}

function writeConfigFile(configFile, configFilePath) {
  let content = JSON.stringify(configFile);
  fs.writeFile(String(configFilePath), content, "utf8", function (err) {
    if (err) {
      console.log(err);
      writeFileStatus = false;
      return;
    }
  });
  writeFileStatus = true;
  console.log("[ConfigSoilMoisture] write file with no error");
}

function seekGreenHouseIdIndex(dataArray, greenHouseId) {
  let index = dataArray.findIndex(function (item, i) {
    return item.greenHouseId === greenHouseId;
  });
  return index;
}