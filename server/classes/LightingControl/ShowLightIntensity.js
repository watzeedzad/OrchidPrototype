const mongoose = require("mongoose");
const greenHouseSensor = mongoose.model("greenHouse_Sensor")

let configFile;
let greenHouseSensorData;

export default class ShowLightIntensity {
    constructor(req, res) {
        this.operation(req, res);
    }

    async operation(req, res) {
        console.log("[ShowLightIntensity] session id: " + req.session.id);
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
        let greenHouseId = req.body.greenHouseId;
        if (typeof greenHouseId === "undefined") {
            res.json({
                status: 500,
                errorMessage: "เกิดข้อผิดพลาดในการแสดงค่าความเข้มแสง"
            });
            return;
        }
        greenHouseSensorData = await getGreenHouseSesor(greenHouseId, req.session.farmId);
        if (greenHouseSensorData == null) {
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
            let greenHouseIdIndex = await seekGreenHouseIdIndex(configFile.lightIntensityConfigs, greenHouseId);
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
                currentLightIntensity: currentLightIntensity
            };
            res.json(showTemp);
        }
    }
}

function getConfigFile(req, callback) {
    // console.log("[LightIntensityConfig] getConfigFilePath: " + req.session.configFilePath);
    let config = JSON.parse(
        require("fs").readFileSync(String(req.session.configFilePath), "utf8")
    );
    // configFile = config;
    callback(config);
}

async function getGreenHouseSesor(greenHouseId, farmId) {
    // let result = await greenHouseSensor.findOne({
    //     greenHouseId: greenHouseId,
    //     farmId: req.session.farmData.farmId
    // }, {}, {
    //     sort: {
    //         _id: -1
    //     }
    // });
    // if (result) {
    //     greenHouseSensorData = result;
    // } else {
    //     greenHouseSensorData = undefined;
    //     console.log("Query fail!");
    // }
    let result = await greenHouseSensor.findOne({
        greenHouseId: greenHouseId,
        farmId: farmId
    }, null, {
        sort: {
            _id: -1
        }
    }, (err, result) => {
        if (err) {
            greenHouseSensorData = null;
            console.log("[ShowLightIntensity] getGreenhouseSensor (err): " + err);
        } else if (!result) {
            greenHouseSensorData = null;
            console.log("[ShowLightIntensity] getGreenhouseSensor (!result): " + result);
        } else {
            greenHouseSensorData = result;
        }
    });
    return result;
}

function seekGreenHouseIdIndex(dataArray, greenHouseId) {
    let index = dataArray.findIndex(function (item, i) {
        return item.greenHouseId === greenHouseId;
    });
    return index;
}