import InsertRelayCommand from "./InsertRelayCommand";

const mongoose = require("mongoose");
const fs = require("fs");
const farm = mongoose.model("farm");
const know_controller = mongoose.model("know_controller");
const project = mongoose.model("project");

let farmData;
let configFile;
let controllerData;
let minFertility;
let maxFertility;

export default class FertilityCheck {
    constructor(req, res) {
        this.process(req, res)
    }

    async process(req, res) {
        let piMacAddress = req.body.macAddress;
        let ipIn = req.body.ip;
        if (typeof ipIn === "undefined" || typeof piMacAddress === "undefined") {
            req.session.fertilityCheckStatus = 500;
            return;
        }
        let controllerResult = await know_controller.findOne({
            ip: ipIn,
            piMacAddress: piMacAddress
        }, function (err, result) {
            if (err) {
                console.log("[FertilityCheck] Query fail!, know_controller");
            } else {
                console.log("[FertilityCheck] Query success, know_controller")
            }
        });
        let greenHouseId = controllerResult.greenHouseId;
        let farmId = controllerResult.farmId;
        console.log("[FertilityCheck] greenHouseId_Class, " + greenHouseId);
        console.log("[FertilityCheck] farmId_Class, " + farmId);
        await getConfigFile(farmId);
        await getControllerData(greenHouseId, piMacAddress);
        if (typeof controllerData === "undefined") {
            req.session.fertilityCheckStatus = 200;
            return;
        }
        let projectIdIndex = await seekProjectIdIndex(configFile.fertilityConfigs, projectId);
        if (projectIdIndex == -1) {
            req.session.fertilityCheckStatus = 500;
            return;
        }
        let resultCompareFertility = await compareFertility(configFile, req.body.fertility, projectIdIndex);
        console.log("[FertilityCheck] compareFertility: " + resultCompareFertility);
        if (typeof resultCompareFertility === "undefined") {
            req.session.fertilityCheckStatus = 500;
            return;
        }
        if (resultCompareFertility) {
            new InsertRelayCommand(controllerData.ip, "fertilizer", true, farmData.piMacAddress);
            // onOffFertilizerPump(controllerData.ip, true);
        } else {
            new InsertRelayCommand(controllerData.ip, "fertilizer", false, farmData.piMacAddress);
            // onOffFertilizerPump(controllerData.ip, false);
        }
        req.session.fertilityCheckStatus = 200;
        return;
    }
}

async function getControllerData(projectId, piMacAddress) {
    let controllerResult = await know_controller.findOne({
        isHavePump: true,
        "pumpType.fertilizer": true,
        projectId: projectId,
        piMacAddress: piMacAddress
    }, function (err, result) {
        if (err) {
            controllerData = undefined;
            console.log("[FertilityCheck] Query fail!, know_controller2");
        } else {
            controllerData = result;
        }
    });
}

// function onOffFertilizerPump(ip, state) {
//     if (state) {
//         console.log("Send: /fertilizerPump?params=0 (on)");
//         request
//             .get("http://" + String(ip) + "/fertilizerPump?params=0", {
//                 timeout: 20000
//             })
//             .on("error", function (err) {
//                 console.log(err.code === "ETIMEDOUT");
//                 console.log(err.connect === true);
//                 console.log(err);
//             });
//     } else {
//         console.log("Send: /fertilizerPump?params=1 (off)");
//         request
//             .get("http://" + String(ip) + "/fertilizerPump?params=1", {
//                 timeout: 20000
//             })
//             .on("error", function (err) {
//                 console.log(err.code === "ETIMEDOUT");
//                 console.log(err.connect === true);
//                 console.log(err);
//             });
//     }
// }

async function getConfigFile(farmIdIn) {
    let farmResult = await farm.findOne({
        farmId: farmIdIn
    }, function (err, result) {
        if (err) {
            console.log("[FertilityCheck] getConfigFile, fail");
        } else {
            console.log("[FertilityCheck] getConfigFile, pass");
            farmData = result;
        }
    });
    let configFilePath = farmResult.configFilePath;
    let config = JSON.parse(fs.readFileSync(String(configFilePath), "utf8"));
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