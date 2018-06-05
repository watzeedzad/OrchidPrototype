const mongoose = require("mongoose");
const know_controller = mongoose.model("know_controller");
const request = require("request");

let controllerData;

export default class ManualWater {
    constructor(req, res) {
        this.process(req, res);
    }

    async process(req, res) {

    }
}

async function getControllerData(greenHouseId) {
    console.log("enter xx");
    let controllerResult = await know_controller.findOne({
        isHavePump: true,
        "pumpType.water": true,
        greenHouseId: greenHouseId
    }, function (err, result) {
        if (err) {
            controllerData = u 
            console.log("Query fail!, know_controller2");
        } else {
            controllerData = result;
        }
    });
}

async function ManualOnWaterPump(ip, litre) {
    console.log("Send: /waterPump?params="+litre);
    request.get("http://" +String(ip)+"/waterPump?params=" + litre)
}