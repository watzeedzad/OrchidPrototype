import InsertRelayManualCommand from "../Utils/InsertRelayManualCommand";

const mongoose = require("mongoose");
const know_controller = mongoose.model("know_controller");
const request = require("request");

let controllerData;

export default class ManualFertilizer {
    constructor(req, res) {
        this.process(req, res);
    }

    async process(req, res) {
        if (typeof req.session.farmData === "undefined" || typeof req.session.configFilePath === "undefined") {
            res.sendStatus(500);
            return;
        }
        console.log("[ManualFertilizer] session id: " + req.session.id);
        // req.session.reload(function (err) {
        //     console.log("[ManualFertilizer] " + err);
        // });
        let greenHouseId = req.body.greenHouseId;
        let inputLitre = req.body.litre;
        if (typeof greenHouseId === "undefined" || typeof inputLitre === "undefined") {
            res.json({
                status: 500,
                errorMessage: "เกิดข้อผิดพลาดในการสั่งให้ปุ๋ยแบบแมนนวล"
            });
            return;
        }
        console.log("[ManualFertilizer] greenHouseId, " + greenHouseId);
        console.log("[ManualFertilizer] inputLitre, " + inputLitre);
        await getControllerData(greenHouseId);
        if (typeof controllerData === "undefined") {
            res.sendStatus(200);
            return;
        }
        new InsertRelayManualCommand(controllerData.ip, "fertilizer", farmData.piMacAddress, inputLitre);
        re.sendStatus(200);
    }
}

async function getControllerData(greenHouseId) {
    let controllerResult = await know_controller.findOne({
        isHavePump: true,
        "pumpType.fertilizer": true,
        greenHouseId: greenHouseId
    }, function (err, result) {
        if (err) {
            controllerData = undefined;
            console.log("[ManualWater] Query fail!, know_controller2");
        } else {
            controllerData = result;
        }
    });
}

// function manualOnFertilizerPump(ip, litre) {
//     console.log("Send: /manualFertilizer?params=" + litre);
//     request.get("http://" + String(ip) + "/manualFertilizer?params=" + litre, {
//             timeout: 20000
//         })
//         .on("error", function (err) {
//             return false;
//             console.log(err.code === "ETIMEDOUT");
//             console.log(err.connect == true);
//             console.log(err);
//         });
//     return true;
// }