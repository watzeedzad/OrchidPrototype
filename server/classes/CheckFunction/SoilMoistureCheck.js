import InsertRelayCommand from "../Utils/InsertRelayCommand";

const mongoose = require("mongoose");
const fs = require("fs");
const farm = mongoose.model("farm");
const know_controller = mongoose.model("know_controller");

let configFile;
let controllerData;
let minSoilMoisture;
let maxSoilMoisture;

export default class SoilMoistureCheck {
    constructor(req, res) {
        this.check(req, res);
    }

    async check(req, res) {
        let ipIn = req.body.ip;
        let piMacAddress = req.body.piMacAddress;
        if (typeof ipIn === "undefined" || typeof piMacAddress === "undefined") {
            req.session.soilMoistureCheckStatus = 500;
            return;
        }
        let controllerResult = await know_controller.findOne({
            ip: ipIn,
            piMacAddress: piMacAddress
        }, function (err) {
            if (err) {
                console.log("[SoilMoistureCheck] Query fail!, know_controller");
            } else {
                console.log("[SoilMoistureCheck] Query success, know_controller");
            }
        });
        let greenHouseId = controllerResult.greenHouseId;
        let farmId = controllerResult.farmId;
        await getConfigFile(farmId);
        console.log("[SoilMoistureCheck] greenHouseId_Class, " + greenHouseId);
        console.log("[SoilMoistureCheck] farmId_Class, " + farmId);
        await getControllerData(greenHouseId, piMacAddress);
        if (typeof controllerData === "undefined") {
            req.session.soilMoistureCheckStatus = 200;
            return;
        }
        let greenHouseIdIndex = await seekGreenHouseIdIndex(configFile.soilMoistureConfigs, greenHouseId);
        console.log("[SoilMoistureCheck] greenHouseIdIndex: " + greenHouseIdIndex);
        if (greenHouseIdIndex == -1) {
            req.session.soilMoistureCheckStatus = 500;
            return;
        }
        let resultCompareSoilMoisture = await compareSoilMositure(
            configFile,
            req.body.soilMoisture,
            greenHouseIdIndex
        );
        console.log("[SoilMoistureCheck] compareSoilMoisture, " + resultCompareSoilMoisture);
        if (typeof resultCompareSoilMoisture === "undefined") {
            req.session.soilMoistureCheckStatus = 500;
            return;
        } else {
            console.log("[SoilMoistureCheck] enter insert relay command phase");
            if (resultCompareSoilMoisture) {
                new InsertRelayCommand(controllerData.ip, "moisture", true, piMacAddress);
                console.log("[SoilMoistureCheck] farmDataResult.piMacAddress: " + piMacAddress);
                // onOffWaterPump(controllerData.ip, true);
            } else {
                new InsertRelayCommand(controllerData.ip, "moisture", false, piMacAddress);
                console.log("[SoilMoistureCheck] farmDataResult.piMacAddress: " + piMacAddress);
                // onOffWaterPump(controllerData.ip, false);
            }
            req.session.soilMoistureCheckStatus = 200
            return;
        }
    }
}

async function getControllerData(greenHouseId, piMacAddress) {
    await know_controller.findOne({
        isHavePump: true,
        "pumpType.water": true,
        greenHouseId: greenHouseId,
        piMacAddress: piMacAddress
    }, function (err, result) {
        if (err) {
            controllerData = undefined;
            console.log("[SoilMoistureCheck] getControllerData (err): " + err);
        } else if (!result) {
            controllerData = undefined;
            console.log("[SoilMoistureCheck] getControllerData (!result): " + result);
        } else {
            controllerData = result;
        }
    });
}

async function getConfigFile(farmIdIn) {
    let farmData = await farm.findOne({
            farmId: farmIdIn
        },
        function (err, result) {
            if (err) {
                console.log("[LightCheck] getConfigFile (err): " + err);
            } else if (!result) {
                console.log("[LightCheck] getConfigFile (!result): " + result);
            } else {
                console.log("[LightCheck] getConfigFile (result): " + result);
            }
        }
    );
    let configFilePath = farmData.configFilePath;
    let config = JSON.parse(fs.readFileSync(String(configFilePath), "utf8"));
    configFile = config;
}

// function onOffWaterPump(ip, state) {
//     if (state) {
//         console.log("Send: /waterPump?params=0 (on)");
//         request
//             .get("http://" + String(ip) + "/waterPump?params=0", {
//                 timeout: 20000
//             })
//             .on("error", function (err) {
//                 console.log(err.code === "ETIMEDOUT");
//                 console.log(err.connect === true);
//                 console.log(err);
//             });
//     } else {
//         console.log("Send: /waterPump?params=1 (off)");
//         request
//             .get("http://" + String(ip) + "/waterPump?params=1", {
//                 timeout: 20000
//             })
//             .on("error", function (err) {
//                 console.log(err.code === "ETIMEDOUT");
//                 console.log(err.connect === true);
//                 console.log(err);
//             });
//     }
// }

function compareSoilMositure(configFile, currentSoilMoisture, greenHouseIdIndex) {
    minSoilMoisture = configFile.soilMoistureConfigs[greenHouseIdIndex].minSoilMoisture;
    maxSoilMoisture = configFile.soilMoistureConfigs[greenHouseIdIndex].maxSoilMoisture;
    console.log("[SoilMoistureCheck] MIN-SM: " + minSoilMoisture);
    console.log("[SoilMoistureCheck] MAX-SM: " + maxSoilMoisture);
    console.log("[SoilMoistureCheck] CURRENT-SM: " + currentSoilMoisture);
    if (minSoilMoisture == null || maxSoilMoisture == null) {
        return undefined;
    } else if (minSoilMoisture < currentSoilMoisture) {
        return false;
    } else if (minSoilMoisture > currentSoilMoisture) {
        return true;
    }
}

function seekGreenHouseIdIndex(dataArray, greenHouseId) {
    console.log(dataArray);
    let index = dataArray.findIndex(function (item, i) {
        return item.greenHouseId === greenHouseId;
    });
    return index;
}