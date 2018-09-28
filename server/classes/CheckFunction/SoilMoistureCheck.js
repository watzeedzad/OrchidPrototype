import InsertRelayCommand from "../Utils/InsertRelayCommand";

const mongoose = require("mongoose");
const fs = require("fs");
const farm = mongoose.model("farm");
const know_controller = mongoose.model("know_controller");

let configFile;
let controllerDataResult;
let minSoilMoisture;
let maxSoilMoisture;

export default class SoilMoistureCheck {
    constructor(req) {
        this.check(req);
    }

    async check(req) {
        let greenHouseId = req.body.greenHouseId;
        let farmId = req.body.farmId;
        let soilMoisture = req.body.soilMoisture;
        let piMacAddress = req.body.piMacAddress;
        if (typeof greenHouseId === "undefined" || typeof farmId === "undefined" || typeof soilMoisture === "undefined" || typeof piMacAddress === "undefined") {
            req.session.soilMoistureCheckStatus = 500;
            return;
        }
        await getConfigFile(farmId);
        await getControllerData(greenHouseId, farmId);
        if (typeof controllerDataResult === "undefined") {
            req.session.soilMoistureCheckStatus = 200;
            return;
        }
        let greenHouseIdIndexSoilMoisture = await seekGreenHouseIdIndex(configFile.soilMoistureConfigs, greenHouseId);
        let greenHouseIdTimeIndex = await seekGreenHouseIdIndex(configFile.watering, greenHouseId);
        console.log("[SoilMoistureCheck] greenHouseIdIndexSoilMoisture: " + greenHouseIdIndexSoilMoisture);
        console.log("[SoilMoistureCheck] greenHouseIdTimeIndex: " + greenHouseIdTimeIndex);
        if (greenHouseIdIndexSoilMoisture == -1 || greenHouseIdTimeIndex == -1) {
            req.session.soilMoistureCheckStatus = 500;
            return;
        }
        let checkTimeResult = false;
        let currentDate = new Date();
        for (let index = 0; index < configFile.watering[greenHouseIdTimeIndex].timeRanges.length; index++) {
            console.log("[SoilMoistureCheck] enter loop: " + index);
            let tempDate = new Date(configFile.watering[greenHouseIdTimeIndex].timeRanges[index]);
            if (tempDate.getHours() == currentDate.getHours() && tempDate.getMinutes() == currentDate.getMinutes()) {
                console.log("[SoilMoistureCheck] checkTime enter CASE 1");
                checkTimeResult = true;
            } else if (tempDate.getHours() == currentDate.getHours() && tempDate.getMinutes() < currentDate.getMinutes()) {
                console.log("[SoilMoistureCheck] checkTime enter CASE 2");
                checkTimeResult = true;
            } else {
                console.log("[SoilMoistureCheck] checkTime enter CASE 3")
                if ((currentDate.getHours() == tempDate.getHours()) || (currentDate.getHours() - tempDate.getHours() <= 2 && currentDate.getHours() - tempDate.getHours() >= 0)) {
                    checkTimeResult = true;
                } else {
                    checkTimeResult = false;
                }
            }
            console.log("[SoilMoistureCheck] end loop: " + index);
        }
        console.log("[SoilMoistureCheck] checkTimeResult: " + checkTimeResult);
        if (!checkTimeResult) {
            req.session.soilMoistureCheckStatus = 200;
            new InsertRelayCommand(controllerDataResult.ip, "water", false, piMacAddress);
            return;
        }
        let resultCompareSoilMoisture = await compareSoilMositure(
            configFile,
            soilMoisture,
            greenHouseIdIndexSoilMoisture
        );
        console.log("[SoilMoistureCheck] compareSoilMoisture, " + resultCompareSoilMoisture);
        if (typeof resultCompareSoilMoisture === "undefined") {
            req.session.soilMoistureCheckStatus = 500;
            return;
        } else {
            console.log("[SoilMoistureCheck] enter insert relay command phase");
            if (resultCompareSoilMoisture) {
                new InsertRelayCommand(controllerDataResult.ip, "water", true, piMacAddress);
                console.log("[SoilMoistureCheck] farmDataResult.piMacAddress: " + piMacAddress);
                // onOffWaterPump(controllerDataResult.ip, true);
            } else {
                new InsertRelayCommand(controllerDataResult.ip, "water", false, piMacAddress);
                console.log("[SoilMoistureCheck] farmDataResult.piMacAddress: " + piMacAddress);
                // onOffWaterPump(controllerDataResult.ip, false);
            }
            req.session.soilMoistureCheckStatus = 200
            return;
        }
    }
}

async function getControllerData(greenHouseId, farmId) {
    await know_controller.findOne({
        isHaveRelay: true,
        "relayType.water": true,
        greenHouseId: greenHouseId,
        farmId: farmId
    }, function (err, result) {
        if (err) {
            controllerDataResult = undefined;
            console.log("[SoilMoistureCheck] getControllerData (err): " + err);
        } else if (!result) {
            controllerDataResult = undefined;
            console.log("[SoilMoistureCheck] getControllerData (!result): " + result);
        } else {
            controllerDataResult = result;
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

function compareSoilMositure(configFile, currentSoilMoisture, greenHouseIdIndexSoilMoisture) {
    minSoilMoisture = configFile.soilMoistureConfigs[greenHouseIdIndexSoilMoisture].minSoilMoisture;
    maxSoilMoisture = configFile.soilMoistureConfigs[greenHouseIdIndexSoilMoisture].maxSoilMoisture;
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