import InsertRelayManualCommand from "../Utils/InsertRelayManualCommand";

const mongoose = require("mongoose");
const know_controller = mongoose.model("know_controller");

let controllerData;

export default class ManualFertilizer {
    constructor(req, res) {
        this.process(req, res);
    }

    async process(req, res) {
        console.log("[ManualFertilizer] session id: " + req.session.id);
        if (typeof req.session.farmData === "undefined" || typeof req.session.configFilePath === "undefined") {
            res.sendStatus(401);
            return;
        }
        let projectId = req.body.projectId;
        let inputLitre = req.body.litre;
        if (typeof projectId === "undefined" || typeof inputLitre === "undefined") {
            res.json({
                status: 500,
                errorMessage: "เกิดข้อผิดพลาดในการสั่งให้ปุ๋ยแบบแมนนวล"
            });
            return;
        }
        console.log("[ManualFertilizer] projectId, " + projectId);
        console.log("[ManualFertilizer] inputLitre, " + inputLitre);
        controllerData = await getControllerData(projectId);
        if (controllerData == null) {
            console.log("[ManualWater] controlerData is null");
            res.sendStatus(200);
            return;
        }
        console.log("[ManualFertilitzer] enter insert manual relay phase")
        new InsertRelayManualCommand(controllerData.ip, "fertilizer", req.session.farmData.piMacAddress, inputLitre);
        res.sendStatus(200);
    }
}

async function getControllerData(projectId) {
    let result = await know_controller.findOne({
        isHaveRelay: true,
        "relayType.fertilizer": true,
        projectId: projectId
    }, function (err, result) {
        if (err) {
            controllerData = null;
            console.log("[ManualWater] Query fail!, know_controller2");
        } else if (!result) {
            controllerData = null;
            console.log("[ManualWater] getControllerData (!result): " + result);
        } else {
            controllerData = result;
        }
    });
    return result;
}