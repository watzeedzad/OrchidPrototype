const mongoose = require("mongoose");
const know_controller = mongoose.model("know_controller");
const request = require("request");

let controllerData;

export default class ManualWater {
    constructor(req, res) {
        this.process(req, res);
    }

    async process(req, res) {
        let greenHouseId = req.body.greenHouseId;
        let inputLitre = req.body.litre;
        if (typeof greenHouseId === "undefined" || typeof inputLitre === "undefined") {
            res.sendStatus(500);
        }
        console.log("ManualWater: greenHouseId, " + greenHouseId);
        console.log("ManualWater: inputLitre, " + inputLitre);
        await getControllerData(greenHouseId);
        if (typeof controllerData === "undefined") {
            res.sendStatus(200);
        }
        let status = manualOnWaterPump(controllerData.ip, inputLitre);
        if (status) {
            res.sendStatus(200);
        } else {
            res.json({
                status: 500,
                message: 'เกิดข้อผิดพลาดในการสั้งรดนํ้า'
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
            console.log("ManualWater: Query fail!, know_controller2");
        } else {
            controllerData = result;
        }
    });
}

async function manualOnWaterPump(ip, litre) {
    console.log("Send: /waterPump?params=" + litre);
    request.get("http://" + String(ip) + "/manualWater?params=" + litre, {
            timeout: 20000
        })
        .on("error", function (err) {
            return false;
            console.log(err.code === "ETIMEDOUT");
            console.log(err.connect == true);
            console.log(err);
        });
    return true;
}