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
        console.log("enter 1");
        let ipIn = req.body.ip;
        let controllerResult = await know_controller.findOne({
            ip: ipIn
        }, function (err, result) {
            if (err) {
                console.log("Query fail!, know_controller");
            } else {
                console.log("Query success, know_controller")
            }
        });
        console.log("controllerResult: " + controllerResult)
        let greenHouseId = controllerResult.greenHouseId;
        console.log("greenHouseId_Class: " + greenHouseId);
        await getControllerData(greenHouseId);
        if (typeof controllerData === "undefined") {
            greenHouseSensorRouteStatus = 200;
            return;
        }
        let farmId = controllerResult.farmId;
        console.log("farmId_Class: " + farmId);
        await getConfigFile(farmId);
        let resultCompareSoilMoisture = await compareSoilMositure(
            configFile,
            req.body.soilMoisture
        );
        console.log("compareSoilMoisture: " + resultCompareSoilMoisture);
        if (typeof resultCompareSoilMoisture === "undefined") {
            greenHouseSensorRouteStatus = 500;
            return;
        } else {
            console.log("controllerData_SoilMoisture: " + controllerData);
            if (resultCompareSoilMoisture) {
                onOffWaterPump(controllerData.ip, true);
            } else {
                onOffWaterPump(controllerData.ip, false);
            }
            greenHouseSensorRouteStatus = 200
            return;
        }
    }
}

async function getControllerData(greenHouseId) {
    console.log("enter xx");
    let controllerResult = await know_controller.findOne({
        isHavePump: true,
        "pumpType.water": true,
        greenHouseId: greenHouseId
    }, function (err, result) {
        if (err) {
            controllerData = undefined;
            console.log("Query fail!, know_controller2");
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
            console.log("fail");
        } else {
            console.log("pass");
        }
    });
    console.log("getConfigFile: " + farmResult);
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
                timeout: 5000
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
                timeout: 5000
            })
            .on("error", function (err) {
                console.log(err.code === "ETIMEDOUT");
                console.log(err.connect === true);
                console.log(err);
            });
    }
}

function compareSoilMositure(configFile, currentSoilMoisture) {
    minSoilMoisture = configFile.minSoilMoisture;
    maxSoilMoisture = configFile.maxSoilMoisture;
    console.log("MIN-SM: " + maxSoilMoisture);
    console.log("MAX-SM: " + maxSoilMoisture);
    console.log("CURRENT-SM: " + currentSoilMoisture);
    if (maxSoilMoisture == null || maxSoilMoisture == null) {
        return undefined;
    } else if (maxSoilMoisture < currentSoilMoisture) {
        return false;
    } else if (minSoilMoisture > currentSoilMoisture) {
        return true;
    }
}