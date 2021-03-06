const mongoose = require("mongoose");
const lightDuration = mongoose.model("light_duration");

let configFile;
let lightDurationData;

export default class ShowLightVolumeConfig {
    constructor(req, res) {
        this.operation(req, res);
    }

    async operation(req, res) {
        console.log("[ShowLightVolume] session id: " + req.session.id);
        if (typeof req.session.farmData === "undefined" || typeof req.session.configFilePath === "undefined") {
            res.sendStatus(401);
            return;
        }
        await getConfigFile(req, function (config) {
            configFile = config;
        });
        let greenHouseId = req.body.greenHouseId;
        console.log("[ShowLightVolume] greenHouseId: " + greenHouseId);
        if (typeof greenHouseId === "undefined") {
            res.json({
                status: 500,
                errorMessage: "เกิดข้อผิดพลาดในการแสดงค่าปริมาณแสง"
            })
            return;
        }
        lightDurationData = await getLightDurationData(greenHouseId, req.session.farmId);
        if (lightDurationData == null) {
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
            let greenHouseIdIndex = await seekGreenHouseIdIndex(configFile.lightVolumeConfigs, greenHouseId);
            console.log("[ShowLightVolume] greenHouseIdIndex: " + greenHouseIdIndex);
            if (greenHouseIdIndex == -1) {
                res.json({
                    status: 500,
                    errorMessage: "เกิดข้อผิดพลาดในการแสดงค่าปริมาณแสง"
                });
                return;
            }
            let maxLightVolume = configFile.lightVolumeConfigs[greenHouseIdIndex].maxLightVolume;
            let currentLightVolume = lightDurationData.duration;
            var showTemp = {
                maxLightVolume: maxLightVolume,
                currentLightVolume: currentLightVolume
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

async function getLightDurationData(greenHouseId, farmId) {
    // let result = await greenHouseSensor.findOne({
    //     greenHouseId: greenHouseId,
    //     farmId: req.session.farmData.farmId
    // }, {}, {
    //     sort: {
    //         _id: -1
    //     }
    // });
    // if (result) {
    //     lightDurationData = result;
    // } else {
    //     lightDurationData = undefined;
    //     console.log("Query fail!");
    // }
    let result = await lightDuration.findOne({
        greenHouseId: greenHouseId,
        farmId: farmId
    }, null, {
        sort: {
            _id: -1
        }
    }, (err, result) => {
        if (err) {
            lightDurationData = null
            console.log("[ShowLightIntensity] getLightDurationData (err): " + err);
        } else if (!result) {
            lightDurationData = null;
            console.log("[ShowLightIntensity] getLightDurationData (!result): " + result);
        } else {
            lightDurationData = result;
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