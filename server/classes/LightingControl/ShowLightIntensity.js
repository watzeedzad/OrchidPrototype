const mongoose = require("mongoose");
const fs = require("fs");
const greenHouseSensor = mongoose.model("greenHouse_Sensor")

let configFile;
let greenHouseSensorData;

export default class ShowLightIntensity {
    constructor(req, res) {
        this.operation(req, res);
    }

    async operation(req, res) {
        if (typeof req.session.farmData === "undefined" || typeof req.session.configFilePath === "undefined") {
            res.sendStatus(500);
            return;
        }
        console.log("[ShowLightIntensity] session id: " + req.session.id);
        req.session.reload(function (err) {
            console.log("[ShowLightIntensity] " + err);
        });
        await getGreenHouseSesor(greenHouseId);
        await getConfigFile(req);
        if (typeof greenHouseSensorData === "undefined") {
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
                    errorMessage: "เกิดข้อผิดพลาดในการแสดงค่าความเข้มแสง"
                });
                return;
            }
            let minLightIntensity = configFile.lightIntensityConfigs[greenHouseIdIndex].minLightIntensity;
            let maxLightIntensity = configFile.lightIntensityConfigs[greenHouseIdIndex].maxLightIntensity;
            let currentLightIntensity = greenHouseSensorData.ambientLight;
            var showTemp = {
                minLightIntensity: minLightIntensity,
                maxLightIntensity: maxLightIntensity,
                currentLightIntensity: ambientLight
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

async function getGreenHouseSesor(greenHouseId) {
    let result = await greenHouseSensor.findOne({
        greenHouseId: greenHouseId,
        farmId: req.session.farmData.farmId
    }, {}, {
        sort: {
            _id: -1
        }
    });
    if (result) {
        greenHouseSensorData = result;
    } else {
        greenHouseSensorData = undefined;
        console.log("Query fail!");
    }
    // console.log(greenHouseSensorData);
}