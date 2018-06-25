const mongoose = require("mongoose");
const fs = require("fs");
const request = require("request");
const farm = mongoose.model("farm");
const know_controller = mongoose.model("know_controller");
const project = mongoose.model("project");

let configFile;
let controllerData;
let minFertility;
let maxFertility;

export default class FertilityCheck {
    constructor(req, res) {
        this.process(req, res)
    }

    async process(req, res) {
        let ipIn = req.body.ip;
        if (typeof ipIn === "undefined") {
            fertilityCheckStatus = 500;
            return;
        }
        let controllerResult = await know_controller.findOne({
            ip: ipIn
        }, function (err, result) {
            if (err) {
                console.log("[FertilityCheck] Query fail!, know_controller");
            } else {
                console.log("[FertilityCheck] Query success, know_controller")
            }
        });
        let greenHouseId = controllerResult.greenHouseId;
        console.log("[FertilityCheck] greenHouseId_Class, " + greenHouseId);
        await getControllerData(greenHouseId);
        if (typeof controllerData === "undefined") {
            fertilityCheckStatus = 200;
            return;
        }
        let farmId = controllerResult.farmId;
        console.log("[FertilityCheck] farmId_Class, " + farmId);
        await getConfigFile(farmId);
        let projectIdIndex = await seekProjectIdIndex(configFile, projectId);
        if (greenHouseIdIndex == -1) {
            fertilityCheckStatus = 500;
            return;
        }
        let resultCompareFertility = await compareFertility(configFile, req.body.fertility, projectIdIndex);
        console.log("[FertilityCheck] compareFertility: " + resultCompareFertility);
        if (typeof resultCompareFertility === "undefined") {
            fertilityCheckStatus = 500;
            return;
        }
        if (resultCompareFertility) {
            onOffFertilizerPump(controllerData.ip, true);
        } else {
            onOffFertilizerPump(controllerData.ip, false);
        }
        fertilityCheckStatus = 200;
        return;
    }
}

async function getControllerData(greenHouseId) {
    let controllerResult = await know_controller.findOne({
        isHavePump: true,
        "pumpType.fertility": true,
        projectId: projectId
    }, function (err, result) {
        if (err) {
            controllerData = undefined;
            console.log("[FertilityCheck] Query fail!, know_controller2");
        } else {
            controllerData = result;
        }
    });
}

function onOffFertilizerPump(ip, state) {
    if (state) {
        console.log("Send: /waterFertilizer?params=0 (on)");
        request
            .get("http://" + String(ip) + "/waterFertilizer?params=0", {
                timeout: 20000
            })
            .on("error", function (err) {
                console.log(err.code === "ETIMEDOUT");
                console.log(err.connect === true);
                console.log(err);
            });
    } else {
        console.log("Send: /waterFertilizer?params=1 (off)");
        request
            .get("http://" + String(ip) + "/waterFertilizer?params=1", {
                timeout: 20000
            })
            .on("error", function (err) {
                console.log(err.code === "ETIMEDOUT");
                console.log(err.connect === true);
                console.log(err);
            });
    }
}

async function getConfigFile(farmIdIn) {
    let farmResult = await farm.findOne({
        farmId: farmIdIn
    }, function (err, result) {
        if (err) {
            console.log("[FertilityCheck] getConfigFile, fail");
        } else {
            console.log("[FertilityCheck] getConfigFile, pass");
        }
    });
    let configFilePath = farmResult.configFilePath;
    let config = JSON.parse(
        require("fs").readFileSync(String(configFilePath), "utf8")
    );
    configFile = config;
}

function compareFertility(configFile, currentFertility, projectIdIndex) {
    minFertility = configFile.fertilityConfigs[projectIdIndex].minFertility;
    maxFertility = configFile.fertilityConfigs[projectIdIndex].maxFertility;
    console.log("[FertilityCheck] MIN-F: " + minSoilMoisture);
    console.log("[FertilityCheck] MAX-F: " + maxSoilMoisture);
    console.log("[FertilityCheck] CURRENT-F: " + currentFertility);
    if (minFertility == null || maxFertility == null) {
        return undefined;
    } else if (minFertility < currentFertility) {
        return false;
    } else if (minFertility > currentFertility) {
        return true;
    }
}

function seekProjectIdIndex(dataArray, projectId) {
    console.log(dataArray);
    let index = dataArray.findIndex(function (item, i) {
        return item.projectId === projectId;
    });
    return index;
}