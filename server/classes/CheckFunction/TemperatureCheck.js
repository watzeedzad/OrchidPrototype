import InsertRelayCommand from "../Utils/InsertRelayCommand";

const mongoose = require("mongoose");
const fs = require("fs");
const farm = mongoose.model("farm");
const know_controller = mongoose.model("know_controller");

let configFile;
let controllerDataResult;
let minTemperature;
let maxTemperature;
let minHumidity;
let maxHumidity;

export default class TemperatureCheck {
    constructor(req) {
        this.check(req);
    }

    async check(req) {
        let greenHouseId = req.body.greenHouseId;
        let farmId = req.body.farmId;
        let temperature = req.body.temperature;
        let humidity = req.body.humidity;
        let piMacAddress = req.body.piMacAddress;
        if (typeof greenHouseId === "undefined" || typeof farmId === "undefined" || typeof temperature === "undefined" || typeof humidity === "undefined" || typeof piMacAddress === "undefined") {
            req.session.temperatureCheckStatus = 500;
            return;
        }
        await getConfigFile(farmId);
        await getControllerData(greenHouseId, farmId);
        if (typeof controllerDataResult === "undefined") {
            req.session.temperatureCheckStatus = 200;
            return;
        }
        let greenHouseIdIndexTemperature = await seekGreenHouseIdIndex(configFile.temperatureConfigs, greenHouseId);
        let greenHouseIdIndexHumidity = await seekGreenHouseIdIndex(configFile.humidityConfigs, greenHouseId);
        console.log("[TemperatureCheck] greenHouseIdIndexTemperature: " + greenHouseIdIndexTemperature);
        console.log("[TemperatureCheck] greenHouseIdIndexHumidity: " + greenHouseIdIndexHumidity);
        if (greenHouseIdIndexTemperature == -1 || greenHouseIdIndexHumidity == -1) {
            req.session.temperatureCheckStatus = 500;
            return;
        }
        let resultCompareHumid = await compareHumidity(
            configFile,
            humidity,
            greenHouseIdIndexHumidity
        );
        let resultCompareTemp = await compareTemperature(
            configFile,
            temperature,
            greenHouseIdIndexTemperature
        );
        console.log("[TemperatureCheck] compareTemp, " + resultCompareTemp);
        console.log("[TemperatureCheck] compareHumid, " + resultCompareHumid);
        if (
            typeof resultCompareTemp === "undefined" ||
            typeof resultCompareHumid === "undefined"
        ) {
            req.session.temperatureCheckStatus = 500;
            return;
        } else {
            console.log("[TemperatureCheck] enter insert relay command phase");
            if (!resultCompareTemp) {
                new InsertRelayCommand(controllerDataResult.ip, "moisture", true, piMacAddress);
                console.log("[TemperatureCheck] farmDataResult.piMacAddress: " + piMacAddress);
                // onOffMoisturePump(controllerDataResult.ip, true);
            }
            if (!resultCompareHumid) {
                new InsertRelayCommand(controllerDataResult.ip, "moisture", true, piMacAddress);
                console.log("[TemperatureCheck] farmDataResult.piMacAddress: " + piMacAddress);
                // onOffMoisturePump(controllerDataResult.ip, true);
            }
            if (resultCompareTemp && resultCompareHumid) {
                new InsertRelayCommand(controllerDataResult.ip, "moisture", false, piMacAddress);
                console.log("[TemperatureCheck] farmDataResult.piMacAddress: " + piMacAddress);
                // onOffMoisturePump(controllerDataResult.ip, false);
            }
            req.session.temperatureCheckStatus = 200
            return;
        }
    }
}

async function getControllerData(greenHouseId, farmId) {
    await know_controller.findOne({
        isHavePump: true,
        "pumpType.moisture": true,
        greenHouseId: greenHouseId,
        farmId: farmId
    }, function (err, result) {
        if (err) {
            controllerDataResult = undefined;
            console.log("[TemperatureCheck] getControllerData (err): " + err);
        } else if (!result) {
            controllerDataResult = undefined;
            console.log("[TemperatureCheck] getControllerData (!result): " + result);
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

// function onOffMoisturePump(ip, state) {
//     if (state) {
//         console.log("Send: /moisturePump?params=0 (on)");
//         request
//             .get("http://" + String(ip) + "/moisturePump?params=0", {
//                 timeout: 20000
//             })
//             .on("error", function (err) {
//                 console.log(err.code === "ETIMEDOUT");
//                 console.log(err.connect === true);
//                 console.log(err);
//             });
//     } else {
//         console.log("Send: /moisturePump?params=1 (off)");
//         request
//             .get("http://" + String(ip) + "/moisturePump?params=1", {
//                 timeout: 20000
//             })
//             .on("error", function (err) {
//                 console.log(err.code === "ETIMEDOUT");
//                 console.log(err.connect === true);
//                 console.log(err);
//             });
//     }
// }

function compareTemperature(configFile, currentTemp, greenHouseIdIndexTemperature) {
    minTemperature = configFile.temperatureConfigs[greenHouseIdIndexTemperature].minTemperature;
    maxTemperature = configFile.temperatureConfigs[greenHouseIdIndexTemperature].maxTemperature;
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