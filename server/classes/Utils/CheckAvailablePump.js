const mongoose = require("mongoose");
const knowController = mongoose.model("know_controller");

let controllerResultData;

export default class CheckAvailablePump {
    constructor(req, res) {
        this.operation(req, res);
    }

    async operation(req, res) {
        console.log("[CheckAvailablePump] session id: " + req.session.id);
        if (typeof req.session.farmData === "undefined" || typeof req.session.configFilePath === "undefined") {
            res.sendStatus(500);
            return;
        }
        let greenHouseId = req.body.greenHouseId;
        let projectId = req.farmId.projectId;
        let pumpType = req.body.pumpType;
        if (typeof pumpType === "undefined") {
            res.json({
                status: 500,
                errorMessage: ""
            });
            return;
        } else {
            if (pumpType == "water") {
                if (typeof greenHouseId === "undefined") {
                    res.json({
                        status: 500,
                        errorMessage: ""
                    });
                    return;
                }
                await getKnowControllerWaterPumpData(req.session.farmId, greenHouseId);
                if (typeof controllerResultData == "undefined") {
                    res.json({
                        status: 200,
                        pumpStatus: false
                    });
                } else {
                    res.json({
                        status: 200,
                        pumpStatus: true
                    });
                }
            } else if (pumpType == "moisture") {
                if (typeof greenHouseId === "undefined") {
                    res.json({
                        status: 500,
                        errorMessage: ""
                    });
                    return;
                }
                await getKnowControllerMoisturePumpData(req.session.farmId, greenHouseId);
                if (typeof controllerResultData == "undefined") {
                    res.json({
                        status: 200,
                        pumpStatus: false
                    });
                } else {
                    res.json({
                        status: 200,
                        pumpStatus: true
                    });
                }
            } else if (pumpType == "fertilizer") {
                if (typeof projectId === "undefined") {
                    res.json({
                        status: 500,
                        errorMessage: ""
                    });
                    return;
                }
                await getKnowControllerFertilizerPumpData(req.session.farmId, projectId);
                if (typeof controllerResultData == "undefined") {
                    res.json({
                        status: 200,
                        pumpStatus: false
                    });
                } else {
                    res.json({
                        status: 200,
                        pumpStatus: true
                    });
                }
            }
        }
    }
}

async function getKnowControllerWaterPumpData(farmId, greenHouseId) {
    await knowController.find({
        isHavePump: true,
        "pumpType.water": true,
        greenHouseId: greenHouseId,
        farmId: farmId
    }, (err, result) => {
        if (err) {
            controllerResultData = undefined;
            console.log("[CheckAvailablePump] getKnowControllerWaterPumpData (err): " + err);
        } else if (!result) {
            controllerResultData = undefined;
            console.log("[CheckAvailablePump] getKnowControllerWaterPumpData (!result): " + result);
        } else {
            controllerResultData = result;
        }
    });
}

async function getKnowControllerMoisturePumpData(farmId, greenHouseId) {
    await knowController.find({
        isHavePump: true,
        "pumpType.moisture": true,
        greenHouseId: greenHouseId,
        farmId: farmId
    }, (err, result) => {
        if (err) {
            controllerResultData = undefined;
            console.log("[CheckAvailablePump] getKnowControllerMoisturePumpData (err): " + err);
        } else if (!result) {
            controllerResultData = undefined;
            console.log("[CheckAvailablePump] getKnowControllerMoisturePumpData (!result): " + result);
        } else {
            controllerResultData = result;
        }
    });
}

async function getKnowControllerFertilizerPumpData(farmId, projectId) {
    await knowController.find({
        isHavePump: true,
        "pumpType.fertilizer": true,
        projectId: projectId,
        farmId: farmId
    }, (err, result) => {
        if (err) {
            controllerResultData = undefined;
            console.log("[CheckAvailablePump] getKnowControllerFertilizerPumpData (err): " + err);
        } else if (!result) {
            controllerResultData = undefined;
            console.log("[CheckAvailablePump] getKnowControllerFertilizerPumpData (!result): " + result);
        } else {
            controllerResultData = result;
        }
    });
}