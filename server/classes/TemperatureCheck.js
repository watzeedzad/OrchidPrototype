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
        if (typeof ipIn === "undefined") {
            temperatureCheckStatus = 500;
            return;
        }
        let controllerResult = await know_controller.findOne({
            ip: ipIn
        }, function (err, result) {
            if (err) {
                console.log("[TemperatureCheck] Query fail!, know_controller");
            } else {
                console.log("[TemperatureCheck] Query success, know_controller")
            }
        });
        let greenHouseId = controllerResult.greenHouseId;
        console.log("[TemperatureCheck] greenHouseId_Class, " + greenHouseId);
        await getControllerData(greenHouseId);
        if (typeof controllerData === "undefined") {
            temperatureCheckStatus = 200;
            return;
        }
        let farmId = controllerResult.farmId;
        console.log("[TemperatureCheck] farmId_Class, " + farmId);
        await getConfigFile(farmId);
        let greenHouseIdIndexTemperature = await seekGreenHouseIdIndex(configFile.temperatureConfigs, greenHouseId);
        let greenHouseIdIndexHumidity = await seekGreenHouseIdIndex(configFile.humidityConfigs, greenHouseId);
        if (greenHouseIdIndexTemperature == -1 || greenHouseIdIndexHumidity == -1) {
            temperatureCheckStatus = 500;
            return;
        }
        let resultCompareHumid = await compareHumidity(
            configFile,
            req.body.humidity,
            greenHouseIdIndexHumidity
        );
        let resultCompareTemp = await compareTemperature(
            configFile,
            req.body.temperature,
            greenHouseIdIndexTemperature
        );
        console.log("[TemperatureCheck] compareTemp, " + resultCompareTemp);
        console.log("[TemperatureCheck] compareHumid, " + resultCompareHumid);
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
            console.log("[TemperatureCheck] Query fail!, know_controller2");
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
            console.log("[TemperatureCheck] getConfigFile, fail");
        } else {
            console.log("[TemperatureCheck] getConfigFile, pass");
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

function compareTemperature(configFile, currentTemp, greenHouseIdIndexTemperature) {
    minTemperature = configFile.temperatureConfigs[greenHouseIdIndexTemperature].minTemperature;
    maxTemperature = configFile.maxTemperature;
    console.log("[TemperatureCheck] MIN-T: " + minTemperature);
    console.log("[TemperatureCheck] MAX-T: " + maxTemperature);
    console.log("[TemperatureCheck] CURRENT-T: " + currentTemp);
    if (minTemperature == null || maxTemperature == null) {
        return undefined;
    } else if (maxTemperature < currentTemp) {
        return false;
    } else if (minHumidity > currentTemp) {
        return true;
    }
}

function compareHumidity(configFile, currentHumid, greenHouseIdIndexHumidity) {
    minHumidity = configFile.humidityConfigs[greenHouseIdIndexHumidity].minHumidity;
    maxHumidity = configFile.humidityConfigs[greenHouseIdIndexHumidity].maxHumidity;
    console.log("[TemperatureCheck] MIN-H: " + minHumidity);
    console.log("[TemperatureCheck] MAX-H: " + maxHumidity);
    console.log("[TemperatureCheck] CURRENT-H: " + currentHumid);
    if (minHumidity == null || maxHumidity == null) {
        return undefined;
    } else if (minHumidity < currentHumid) {
        return true;
    } else if (minHumidity > currentHumid) {
        return false;
    }
}

function seekGreenHouseIdIndex(dataArray, greenHouseId) {
    console.log(dataArray);
    let index = dataArray.findIndex(function (item, i) {
        return item.greenHouseId === greenHouseId;
    });
    return index;
}