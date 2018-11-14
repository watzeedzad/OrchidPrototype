const fs = require("fs");

let configFile;
let writeFileStatus;

export default class ConfigTemperature {
  constructor(req, res) {
    this.process(req, res);
  }

  async process(req, res) {
    console.log("[ConfigTemperature] session id: " + req.session.id);
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
        errorMessage: "เกิดข้อผิดพลาดในการตั้งค่าอุณหภูมิในอากาศ"
      });
      return;
    }
    if (typeof req.body.minTemperature === "undefined" || typeof req.body.maxTemperature === "undefined" || typeof req.body.greenHouseId === "undefined") {
      res.json({
        status: 500,
        errorMessage: "เกิดข้อผิดพลาดในการตั้งค่าอุณหภูมิในอากาศ"
      });
      return;
    }
    let minConfigTemp = parseFloat(req.body.minTemperature);
    console.log("[ConfigTemperature] minConfigTemp: " + minConfigTemp);
    let maxConfigTemp = parseFloat(req.body.maxTemperature);
    console.log("[ConfigTemperature] maxConfigTemp: " + maxConfigTemp);
    let greenHouseId = req.body.greenHouseId;
    console.log("[ConfigTemperature] greenHouseId: " + greenHouseId);
    let greenHouseIdIndex = seekGreenHouseIdIndex(configFile.temperatureConfigs, greenHouseId);
    if (greenHouseIdIndex == -1) {
      res.json({
        status: 500,
        errorMessage: "เกิดข้อผิดพลาดในการตั้งค่าอุณหภูมิในอากาศ"
      });
      return;
    }
    if (minConfigTemp > maxConfigTemp) {
      res.json({
        status: 500,
        errorMessage: "เกิดข้อผิดพลาดในการตั้งค่าอุณหภูมิในอากาศ"
      });
      return;
    }
    let updateData = {
      greenHouseId: greenHouseId,
      minTemperature: minConfigTemp,
      maxTemperature: maxConfigTemp
    }
    configFile.temperatureConfigs[greenHouseIdIndex] = updateData;
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
  // console.log("[ConfigTemperature] getConfigFilePath: " + req.session.configFilePath);
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
  console.log("[ConfigTemperature] write file with no error");
}

function seekGreenHouseIdIndex(dataArray, greenHouseId) {
  let index = dataArray.findIndex(function (item, i) {
    return item.greenHouseId === greenHouseId;
  });
  return index;
}