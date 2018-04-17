const mongoose = require("mongoose");
const fs = require("fs");
const request = require("request");
const farm = mongoose.model("farm");
const know_controller = mongoose.model("know_controller");
const greenHouseSensor = mongoose.model("greenHouse_Sensor");

let farmData;
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
        console.log("enter 1");
        console.log("ip: " + req.body.ip);
        let ipIn = req.body.ip;
        let controllerResult = await know_controller.find({
            ip: ipIn
        }, function (err, result) {
            if (err) {
                console.log("Query fail!, know_controller");
            } else {
                res.controllerDataRes = result;
                console.log(result);
            }
        });
        let greenHouseId = res.controllerDataRes[0].greenHouseId;
        await getControllerData(greenHouseId);
        if (typeof controllerData === "undefined") {
            res.sendStatus(200);
        }
        console.log(controllerData)
        let farmId = controllerData.farmId;
        await getConfigFile(farmId);
        let resultCompareHumid = await compareHumidity(
            configFile,
            req.body.humidity
        );
        let resultCompareTemp = await compareTemperature(
            configFile,
            req.body.temperature
        );
        console.log("compareTemp: " + resultCompareTemp);
        console.log("compareHumid: " + resultCompareHumid);
        if (
            typeof resultCompareTemp === "undefined" ||
            typeof resultCompareHumid === "undefined"
        ) {
            res.sendStatus(500);
        } else {
            if (!resultCompareTemp) {
                onOffWaterPump(controllerData.ip, true);
            }
            if (!resultCompareHumid) {
                onOffWaterPump(controllerData.ip, true);
            }
            if (resultCompareTemp && resultCompareHumid) {
                onOffWaterPump(controllerData.ip, false);
            }
            res.sendStatus(200);
        }
    }
}

async function getControllerData(greenHouseId) {
    console.log("enter xx");
    let controllerResult = await know_controller.findOne({
        isHavePump: true,
        pumpType: "moisture",
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
    var farmResult = await farm.findOne({
        farmId: farmIdIn
    }, function (err, result) {
        if (err) {
            console.log("fail");
        } else {
            farmData = result;
        }
    });
    console.log("getConfigFile: " + farmData);
    let configFilePath = farmData.configFilePath;
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
            .get("http://" + String(ip) + "/waterPump?params=0", {
                timeout: 5000
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