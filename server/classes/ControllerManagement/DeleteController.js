const mongoose = require("mongoose");
const knowController = mongoose.model("know_controller");

let deleteControllerResult;
let findControllerResult;

export default class CreateController {
    constructor(req, res) {
        this.operation(req, res);
    }

    async operation(req, res) {

        let macAddress = req.body.macAddress;
        console.log(macAddress)
        if (typeof macAddress === "undefined") {
            res.json({
                status: 500,
                errorMessage: "macAddress is null"
            });
            return;
        }
        await findController(macAddress);
        if (!findControllerResult) {
            res.json({
                status: 500,
                errorMessage: "controller not found!"
            });
            return;
        }
        await deleteController(macAddress);
        if (deleteControllerResult) {
            res.sendStatus(200);
        } else {
            res.sendStatus(500);
        }
    }
}

async function deleteController(macAddress) {
    await knowController.findOneAndRemove({
        mac_address: macAddress,
    }, function (err) {
        if (err) {
            deleteControllerResult = false;
            console.log("[deleteControllerResult] findAndDeleteController (err):  " + err);
        } else {
            deleteControllerResult = true;
        }
    });
}

async function findController(macAddress) {
    await knowController.findOne({
        mac_address: macAddress
    }, function (err, result) {
        if (err) {
            findControllerResult = false;
            console.log("[DeleteController] findController (err): " + err);
        } else if (!result) {
            findControllerResult = false;
            console.log("[DeleteController] findController (!result): " + result);
        } else {
            findControllerResult = true;
        }
    });
}