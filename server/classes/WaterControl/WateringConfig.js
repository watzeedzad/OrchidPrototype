const fs = require("fs");

let configFile;
let existGreenHouseIndex;
let writeFileStatus;

export default class WateringConfig {
  constructor(req, res) {
    this.process(req, res);
  }

  async process(req, res) {
    console.log("[WateringConfigs] session id: " + req.session.id);
    if (typeof req.session.farmData === "undefined" || typeof req.session.configFilePath === "undefined") {
      res.sendStatus(401);
      return;
    }
    await getConfigFile(req, function (config) {
      configFile = config;
    });
    let greenHouseId = parseInt(req.body.greenHouseId);
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
    // getConfigFile(req);
    let tempJson = {
      greenHouseId: greenHouseId,
      timeRanges: []
    };
    // let wateringConfig = configFile.watering;
    existGreenHouseIndex = await seekGreenHouseIdIndex(configFile.watering, greenHouseId);
    // let tempArray = [];
    // if (!Object.keys(wateringConfig).length == 0) {
    //   for (let index = 0; index < Object.keys(wateringConfig).length; index++) {
    //     let temp = wateringConfig[index];
    //     if (temp.greenHouseId == greenHouseId) {
    //       existGreenHouseIndex = index;
    //     } else {
    //       existGreenHouseIndex = -1;
    //     }
    //   }
    // }
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
  // console.log("[WateringConfigs] getConfigFilePath: " + req.session.configFilePath);
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
  console.log("[WateringConfig] write file with no error");
}

function seekGreenHouseIdIndex(dataArray, greenHouseId) {
  let index = dataArray.findIndex(function (item, i) {
    return item.greenHouseId === greenHouseId;
  });
  return index;
}