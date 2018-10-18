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
            res.sendStatus(401);
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
                controllerResultData = await getKnowControllerWaterPumpData(req.session.farmId, greenHouseId);
                if (controllerResultData == null) {
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
                controllerResultData = await getKnowControllerMoisturePumpData(req.session.farmId, greenHouseId);
                if (controllerResultData == null) {
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
                controllerResultData = await getKnowControllerFertilizerPumpData(req.session.farmId, projectId);
                if (controllerResultData == null) {
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
    let result = await knowController.findOne({
        isHaveRelay: true,
        "relayType.water": true,
        greenHouseId: greenHouseId,
        farmId: farmId
    }, (err, result) => {
        if (err) {
            controllerResultData = null;
            console.log("[CheckAvailablePump] getKnowControllerWaterPumpData (err): " + err);
        } else if (!result) {
            controllerResultData = null;
            console.log("[CheckAvailablePump] getKnowControllerWaterPumpData (!result): " + result);
        } else {
            controllerResultData = result;
        }
    });
    return result;
}

async function getKnowControllerMoisturePumpData(farmId, greenHouseId) {
    let result = await knowController.findOne({
        isHaveRelay: true,
        "relayType.moisture": true,
        greenHouseId: greenHouseId,
        farmId: farmId
    }, (err, result) => {
        if (err) {
            controllerResultData = null;
            console.log("[CheckAvailablePump] getKnowControllerMoisturePumpData (err): " + err);
        } else if (!result) {
            controllerResultData = null;
            console.log("[CheckAvailablePump] getKnowControllerMoisturePumpData (!result): " + result);
        } else {
            controllerResultData = result;
        }
    });
    return result;
}

async function getKnowControllerFertilizerPumpData(farmId, projectId) {
    let result = await knowController.findOne({
        isHavePump: true,
        "pumpType.fertilizer": true,
        projectId: projectId,
        farmId: farmId
    }, (err, result) => {
        if (err) {
            controllerResultData = null;
            console.log("[CheckAvailablePump] getKnowControllerFertilizerPumpData (err): " + err);
        } else if (!result) {
            controllerResultData = null;
            console.log("[CheckAvailablePump] getKnowControllerFertilizerPumpData (!result): " + result);
        } else {
            controllerResultData = result;
        }
    });
    return result;
}