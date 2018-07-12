const mongoose = require("mongoose");
const fs = require("fs");
const lightDuration = require("light_duration");

let configFile;
let lightDurationData;

export default class ShowLightVolumeConfig {
    constructor(req, res) {
        this.operation(req, res);
    }

    async operation(req, res) {
        if (typeof req.session.farmData === "undefined" || typeof req.session.configFilePath === "undefined") {
            res.sendStatus(500);
            return;
        }
        console.log("[ShowLightVolume] session id: " + req.session.id);
        req.session.reload(function (err) {
            console.log("[ShowLightVolume] " + err);
        });
        await getLightDurationData(greenHouseId)
        await getConfigFile(req);
        if (typeof lightDurationData === "undefined") {
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
            let greenHouseIdIndex = await seekGreenHouseIdIndex(configFile.humidityConfigs, greenHouseId);
            if (greenHouseIdIndex == -1) {
              res.json({
                status: 500,
                errorMessage: "เกิดข้อผิดพลาดในการแสดงค่าปริมาณแสง"
              });
              return;
            }
            let minLightVolume = configFile.lightVolumeConfigs[greenHouseIdIndex].minLightVolume;
            let maxLightVolume = configFile.lightVolumeConfigs[greenHouseIdIndex].maxLightVolume;
            let crruentLightVolume = lightDurationData.duration;
            var showTemp = {
              minConfigHumidity: minConfigHumid,
              maxConfigHumidity: maxConfigHumid,
              crruentLightVolume: crruentLightVolume
            };
            res.json(showTemp);
          }
    }
}

function getConfigFile(req) {
    console.log("[LightIntensityConfig] getConfigFilePath: " + req.session.configFilePath);
    let config = JSON.parse(
        require("fs").readFileSync(String(req.session.configFilePath), "utf8")
    );
    configFile = config;
}

async function getLightDurationData(greenHouseId) {
    let result = await greenHouseSensor.findOne({
        greenHouseId: greenHouseId,
        farmId: req.session.farmData.farmId
    }, {}, {
        sort: {
            _id: -1
        }
    });
    if (result) {
        lightDurationData = result;
    } else {
        lightDurationData = undefined;
        console.log("Query fail!");
    }
}