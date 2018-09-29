import InsertRelayManualCommand from "../Utils/InsertRelayManualCommand";

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
        console.log("[ManualWater] session id: " + req.session.id);
        if (typeof req.session.farmData === "undefined" || typeof req.session.configFilePath === "undefined") {
            res.sendStatus(500);
            return;
        }
        let greenHouseId = req.body.greenHouseId;
        let inputLitre = req.body.litre;
        console.log("[ManualWater] greenHouseId: " + greenHouseId);
        console.log("[ManualWater] inputLitre: " + inputLitre);
        if (typeof greenHouseId === "undefined" || typeof inputLitre === "undefined") {
            res.json({
                status: 500,
                errorMessage: "เกิดข้อผิดพลาดในการสั่งรดนํ้าแบบแมนนวล"
            });
            return;
        }
        await getControllerData(greenHouseId);
        if (typeof controllerData === "undefined") {
            res.sendStatus(200);
            return;
        }
        new InsertRelayManualCommand(controllerData.ip, "water", req.session.farmData.piMacAddress, inputLitre);
        res.sendStatus(200);
    }
}

async function getControllerData(greenHouseId) {
    await know_controller.findOne({
        isHaveRelay: true,
        "relayType.water": true,
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