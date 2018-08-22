const mongoose = require("mongoose");
const knowController = mongoose.model("know_controller");
const farm = mongoose.model("farm");

let farmDataResult;
let knowControllerDataResult;
let updateExistControllerResult;

export default class Handler {
    constructor(req, res) {
        this.operation(req, res);
    }

    async operation(req, res) {
        let ipPoolData = req.body.ipPoolData;
        let piMacAddress = req.body.piMacAddress;
        if (typeof ipPoolData === "undefined" || typeof piMacAddress === "undefined") {
            res.sendStatus(500);
            return;
        }
        await getFarmData(piMacAddress);
        if (typeof farmDataResult === "undefined") {
            res.sendStatus(500);
            return;
        }
        for (let index = 0; index < ipPoolData.length; index++) {
            let indexData = String(ipPoolData[index]);
            indexData = indexData.split(" ");
            let ip = indexData[1];
            let macAddress = indexData[2];
            await findExistController(macAddress, piMacAddress, farmDataResult.farmId);
            if (typeof knowControllerDataResult == "undefined") {
                insertKnowController(ip, piMacAddress, macAddress, farmDataResult.farmId);
            } else {
                if (knowControllerDataResult.ip == ip) {
                    return;
                } else {
                    await updateExistController(knowControllerDataResult._id, ip, knowControllerDataResult);
                    if (typeof updateExistControllerResult === "undefined") {
                        return;
                    }
                }
            }
        }
        res.sendStatus(200);
    }
}

async function insertKnowController(ip, macAddress, piMacAddress, farmId) {
    let insertData = {
        ip: ip,
        macAddress: macAddress,
        // farmId: farmId,
        piMacAddress: piMacAddress
    }
    await knowController(insertData).save(function (err) {
        if (!err) {
            console.log("[Handler] insert new controller!")
        } else {
            return console.log(err);
        }
    });
}

async function findExistController(macAddress, piMacAddress, farmId) {
    await knowController.findOne({
        macAddress: macAddress,
        piMacAddress: piMacAddress,
        // farmId: farmId
    }, (err, result) => {
        if (err) {
            knowControllerDataResult = undefined;
            console.log("[Handler] findExistController (err): " + err);
        } else if (!result) {
            knowControllerDataResult = undefined;
            console.log("[Handler] findExistController (!result): " + result);
        } else {
            knowControllerDataResult = result;
            console.log("[Handler] findExistController (result): " + result);
        }
    });
}

async function getFarmData(piMacAddress) {
    await farm.findOne({
        piMacAddress: piMacAddress
    }, (err, result) => {
        if (err) {
            farmDataResult = undefined;
            console.log("[Handler] getFarmData (err): " + err);
        } else if (!result) {
            farmDataResult = undefined;
            console.log("[Handler] getFarmData (!result): " + result);
        } else {
            farmDataResult = result;
            console.log("[Handler] getFarmData (result): " + result)
        }
    });
}

async function updateExistController(id, ip, oldData) {
    oldData.ip = ip;
    knowController.findByIdAndUpdate(id, oldData, {
        new: true
    }, function (err, result) {
        if (err) {
            updateExistControllerResult = undefined;
            console.log("[Handler] updateExistController (err): " + err);
        } else if (!result) {
            updateExistControllerResult = undefined;
            console.log("[Handler] updateExistController (!result): " + result);
        } else {
            updateExistControllerResult = result;
        }
    });
}