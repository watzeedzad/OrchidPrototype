const mongoose = require("mongoose");
const fs = require("fs");
const request = require("request");
const farm = mongoose.model("farm");
const know_controller = mongoose.model("know_controller");
const greenHouseSensor = mongoose.model("greenHouse_Sensor");

let configFile;
let controllerData;
let minTemperature;
let maxTemperature;
let minHumidity;
let maxHumidity;

export default class TemperatureCheck {
    constructor(req, res) {
        this.check(req, res);
    }

    async check(req, res) {
        let ipIn = req.body.ip;
        let controllerResult = await know_controller.findOne({
            ip: ipIn
        }, function (err, result) {
            if (err) {
                console.log("TemperatureCheck: Query fail!, know_controller");
            } else {
                console.log("TemperatureCheck: Query success, know_controller")
            }
        });
        let greenHouseId = controllerResult.greenHouseId;
        console.log("TemperatureCheck: greenHouseId_Class, " + greenHouseId);
        await getControllerData(greenHouseId);
        if (typeof controllerData === "undefined") {
            temperatureCheckStatus = 200;
            return;
        }
        let farmId = controllerResult.farmId;
        console.log("TemperatureCheck: farmId_Class, " + farmId);
        await getConfigFile(farmId);
        let resultCompareHumid = await compareHumidity(
            configFile,
            req.body.humidity
        );
        let resultCompareTemp = await compareTemperature(
            configFile,
            req.body.temperature
        );
        console.log("TemperatureCheck: compareTemp, " + resultCompareTemp);
        console.log("TemperatureCheck: compareHumid, " + resultCompareHumid);
        if (
            typeof resultCompareTemp === "undefined" ||
            typeof resultCompareHumid === "undefined"
        ) {
            temperatureCheckStatus = 500;
            return;
        } else {
            if (!resultCompareTemp) {
                onOffMoisturePump(controllerData.ip, true);
            }
            if (!resultCompareHumid) {
                onOffMoisturePump(controllerData.ip, true);
            }
            if (resultCompareTemp && resultCompareHumid) {
                onOffMoisturePump(controllerData.ip, false);
            }
            temperatureCheckStatus = 200
            return;
        }
    }
}

async function getControllerData(greenHouseId) {
    let controllerResult = await know_controller.findOne({
        isHavePump: true,
        "pumpType.moisture": true,
        greenHouseId: greenHouseId
    }, function (err, result) {
        if (err) {
            controllerData = undefined;
            console.log("TemperatureCheck: Query fail!, know_controller2");
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
            console.log("TemperatureCheck: getConfigFile, fail");
        } else {
            console.log("SoilMoistureCheck: getConfigFile, pass");
        }
    });
    let configFilePath = farmResult.configFilePath;
    let config = JSON.parse(
        require("fs").readFileSync(String(configFilePath), "utf8")
    );
    configFile = config;
}

function onOffMoisturePump(ip, state) {
    if (state) {
        console.log("Send: /moisturePump?params=0 (on)");
        request
            .get("http://" + String(ip) + "/moisturePump?params=0", {
                timeout: 20000
            })
            .on("error", function (err) {
                console.log(err.code === "ETIMEDOUT");
                console.log(err.connect === true);
                console.log(err);
            });
    } else {
        console.log("Send: /moisturePump?params=1 (off)");
        request
            .get("http://" + String(ip) + "/moisturePump?params=1", {
                timeout: 20000
            })
            .on("error", function (err) {
                console.log(err.code === "ETIMEDOUT");
                console.log(err.connect === true);
                console.log(err);
            });
    }
}

function compareTemperature(configFile, currentTemp) {
    minTemperature = configFile.minTemperature;
    maxTemperature = configFile.maxTemperature;
    console.log("MIN-T: " + minTemperature);
    console.log("MAX-T: " + maxTemperature);
    console.log("CURRENT-T: " + currentTemp);
    if (minTemperature == null || maxTemperature == null) {
        return undefined;
    } else if (maxTemperature < currentTemp) {
        return false;
    } else if (minHumidity > currentTemp) {
        return true;
    }
}

function compareHumidity(configFile, currentHumid) {
    minHumidity = configFile.minHumidity;
    maxHumidity = configFile.maxHumidity;
    console.log("MIN-H: " + minHumidity);
    console.log("MAX-H: " + maxHumidity);
    console.log("CURRENT-H: " + currentHumid);
    if (minHumidity == null || maxHumidity == null) {
        return undefined;
    } else if (minHumidity < currentHumid) {
        return true;
    } else if (minHumidity > currentHumid) {
        return false;
    }
}