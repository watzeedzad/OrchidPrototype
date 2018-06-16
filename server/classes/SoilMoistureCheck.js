const mongoose = require("mongoose");
const fs = require("fs");
const request = require("request");
const farm = mongoose.model("farm");
const know_controller = mongoose.model("know_controller");
const greenHouseSensor = mongoose.model("greenHouse_Sensor");

let farmData;
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
        let controllerResult = await know_controller.findOne({
            ip: ipIn
        }, function (err, result) {
            if (err) {
                console.log("[SoilMoistureCheck] Query fail!, know_controller");
            } else {
                console.log("[SoilMoistureCheck] Query success, know_controller")
            }
        });
        let greenHouseId = controllerResult.greenHouseId;
        console.log("[SoilMoistureCheck] greenHouseId_Class, " + greenHouseId);
        await getControllerData(greenHouseId);
        if (typeof controllerData === "undefined") {
            soilMoistureCheck = 200;
            return;
        }
        let farmId = controllerResult.farmId;
        console.log("[SoilMoistureCheck] farmId_Class, " + farmId);
        await getConfigFile(farmId);
        let greenHouseIdIndex = await seekGreenHouseIdIndex(configFile.soilMoistureConfigs, greenHouseId);
        if (greenHouseIdIndex == -1) {
            soilMoistureCheck = 500;
            return;
        }
        let resultCompareSoilMoisture = await compareSoilMositure(
            configFile,
            req.body.soilMoisture,
            greenHouseIdIndex
        );
        console.log("[SoilMoistureCheck] compareSoilMoisture, " + resultCompareSoilMoisture);
        if (typeof resultCompareSoilMoisture === "undefined") {
            soilMoistureCheck = 500;
            return;
        } else {
            if (resultCompareSoilMoisture) {
                onOffWaterPump(controllerData.ip, true);
            } else {
                onOffWaterPump(controllerData.ip, false);
            }
            soilMoistureCheck = 200
            return;
        }
    }
}

async function getControllerData(greenHouseId) {
    let controllerResult = await know_controller.findOne({
        isHavePump: true,
        "pumpType.water": true,
        greenHouseId: greenHouseId
    }, function (err, result) {
        if (err) {
            controllerData = undefined;
            console.log("[SoilMoistureCheck] Query fail!, know_controller2");
        } else {
            controllerData = result;
        }
    });
}

async function getConfigFile(farmIdIn) {
    let farmResult = await farm.findOne({
        farmId: farmIdIn
    }, function (err, result) {
        if (err) {
            console.log("[SoilMoistureCheck] getConfigFile, fail");
        } else {
            console.log("[SoilMoistureCheck] getConfigFile, pass");
        }
    });
    let configFilePath = farmResult.configFilePath;
    let config = JSON.parse(
        require("fs").readFileSync(String(configFilePath), "utf8")
    );
    configFile = config;
}

function onOffWaterPump(ip, state) {
    if (state) {
        console.log("Send: /waterPump?params=0 (on)");
        request
            .get("http://" + String(ip) + "/waterPump?params=0", {
                timeout: 20000
            })
            .on("error", function (err) {
                console.log(err.code === "ETIMEDOUT");
                console.log(err.connect === true);
                console.log(err);
            });
    } else {
        console.log("Send: /waterPump?params=1 (off)");
        request
            .get("http://" + String(ip) + "/waterPump?params=1", {
                timeout: 20000
            })
            .on("error", function (err) {
                console.log(err.code === "ETIMEDOUT");
                console.log(err.connect === true);
                console.log(err);
            });
    }
}

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