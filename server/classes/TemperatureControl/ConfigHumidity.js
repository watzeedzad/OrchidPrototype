const fs = require("fs");
const session = require("express-session");

let configFile;

export default class ConfigHumidity {
  constructor(req, res) {
    this.process(req, res);
  }

  async process(req, res) {
    if (typeof req.session.farmData === "undefined" || typeof req.session.configFilePath === "undefined") {
      res.sendStatus(500);
      return;
    }
    console.log("[ConfigHumidity] session id: " + req.session.id);
    // req.session.reload(function (err) {
    //   console.log("[ConfigHumidity] " + err);
    // });
    // await getConfigFile(req);
    configFile = req.session.configFile;
    if (typeof configFile === "undefined") {
      res.json({
        status: 500,
        errorMessage: "เกิดข้อผิดพลาดไม่สามารถอ่านไฟล์การตั้งค่าได้"
      });
    }
    if (typeof req.body.minHumidity === "undefined" || typeof req.body.maxHumidity === "undefined" || typeof req.body.greenHouseId === "undefined") {
      res.json({
        status: 500,
        errorMessage: "เกิดข้อผิดพลาดในการตั้งค่าความชื้นในอากาศ"
      });
    }
    let minConfigHumid = parseFloat(req.body.minHumidity);
    console.log("[ConfigHumidity] minConfigJumid: " + minConfigHumid);
    let maxConfigHumid = parseFloat(req.body.maxHumidity);
    console.log("[ConfigHumidity] maxConfigHumid: " + maxConfigHumid);
    let greenHouseId = req.body.greenHouseId;
    console.log("[ConfigHumidity] greenHouseId: " + greenHouseId);
    let greenHouseIdIndex = await seekGreenHouseIdIndex(configFile.humidityConfigs, greenHouseId);
    if (greenHouseIdIndex == -1) {
      res.json({
        status: 500,
        errorMessage: "เกิดข้อผิดพลาดในการตั้งค่าความชื้นในอากาศ"
      });
      return;
    }
    if (minConfigHumid > maxConfigHumid) {
      res.json({
        status: 500,
        errorMessage: "เกิดข้อผิดพลาดในการตั้งค่าความชื้นในอากาศ"
      });
      return;
    }
    let updateData = {
      greenHouseId: greenHouseId,
      minHumidity: minConfigHumid,
      maxHumidity: maxConfigHumid
    }
    configFile.humidityConfigs[greenHouseIdIndex] = updateData;
    await writeConfigFile(configFile, res);
  }
}

// function getConfigFile(req) {
//   console.log("getConfigFilePath: " + req.session.configFilePath);
//   let config = JSON.parse(
//     require("fs").readFileSync(String(req.session.configFilePath), "utf8")
//   );
//   configFile = config;
// }

function writeConfigFile(configFile, res) {
  let writeFileResult;
  let content = JSON.stringify(configFile);
  fs.writeFile(String(pathGlobal), content, "utf8", function (err) {
    if (err) {
      console.log(err);
      writeFileResult = false;
    }
    writeFileResult = true;
    console.log("[ConfigHumidity] write file with no error");
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