import InsertRelayManualCommand from "../InsertRelayManualCommand";

const mongoose = require("mongoose");
const know_controller = mongoose.model("know_controller");
const request = require("request");

let controllerData;
let farmData;

export default class ManualWatering {
    constructor(req, res) {
        this.process(req, res);
    }

    async process(req, res) {
        if (typeof req.session.farmData === "undefined" || typeof req.session.configFilePath === "undefined") {
            res.sendStatus(500);
            return;
        }
        console.log("[ManualWater] session id: " + req.session.id);
        req.session.reload(function (err) {
            console.log("[ManualWater] " + err);
        });
        let greenHouseId = req.body.greenHouseId;
        let inputLitre = req.body.litre;
        if (typeof greenHouseId === "undefined" || typeof inputLitre === "undefined") {
            res.json({
                status: 500,
                errorMessage: "เกิดข้อผิดพลาดในการสั่งรดนํ้าแบบแมนนวล"
            });
            return;
        }
        console.log("[ManualWater] greenHouseId, " + greenHouseId);
        console.log("[ManualWater] inputLitre, " + inputLitre);
        await getControllerData(greenHouseId);
        if (typeof controllerData === "undefined") {
            res.sendStatus(200);
            return;
        }
        new InsertRelayManualCommand(controllerData.ip, "water", )
        let status = manualOnWaterPump(controllerData.ip, inputLitre);
        if (status) {
            res.sendStatus(200);
        } else {
            res.json({
                status: 500,
                errorMessage: "เกิดข้อผิดพลาดในการสั่งรดนํ้าแบบแมนนวล"
            })
        }
    }
}

async function getControllerData(greenHouseId) {
    let controllerResult = await know_controller.findOne({
        isHavePump: true,
        "pumpType.water": true,
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

// async function getFarmData

// function manualOnWaterPump(ip, litre) {
//     console.log("Send: /manualWater?params=" + litre);
//     request.get("http://" + String(ip) + "/manualWater?params=" + litre, {
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