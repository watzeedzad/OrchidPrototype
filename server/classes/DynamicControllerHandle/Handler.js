const mongoose = require("mongoose");
const knowController = mongoose.model("know_controller");
const farm = mongoose.model("farm");

let farmDataResult;
let knowControllerDataResult;

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
        let newFormatPiMacAddress;
        console.log("[Handler] ipPoolData : " + ipPoolData);
        console.log("[Handler] piMacAddress : " + piMacAddress);
        let splitChar = piMacAddress[2];
        newFormatPiMacAddress = (piMacAddress.split(splitChar)).toString();
        newFormatPiMacAddress = newFormatPiMacAddress.toLowerCase();
        console.log("[Handler] newFormatPiMacAddress : " + newFormatPiMacAddress);
        await getFarmData(newFormatPiMacAddress);
        if (typeof farmDataResult === "undefined") {
            res.sendStatus(500);
            return;
        }
        for (let index = 0; index < ipPoolData.length; index++) {
            console.log("[Handler] ipPoolData.length : " + ipPoolData.length);
            let indexData = ipPoolData[index];
            console.log("[Handler] indexData : " + indexData);
            indexData = indexData.split(" ");
            let ip = indexData[2];
            let macAddress = indexData[1];
            await findExistController(macAddress, newFormatPiMacAddress, farmDataResult.farmId);
            if (typeof knowControllerDataResult == "undefined") {
                insertKnowController(ip, macAddress, newFormatPiMacAddress, farmDataResult.farmId);
            } else {
                if (knowControllerDataResult.ip != ip) {
                    updateExistController(knowControllerDataResult._id, ip, knowControllerDataResult);
                }
            }
        }
        res.sendStatus(200);
    }
}

async function insertKnowController(ip, macAddress, piMacAddress, farmId) {
    let insertData = {
        ip: ip,
        mac_address: macAddress,
        farmId: farmId,
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
        mac_address: macAddress,
        piMacAddress: piMacAddress,
        farmId: farmId
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

async function updateExistController(macAddress, ip, piMacAddress) {
    knowController.findOneAndUpdate({
        mac_address: macAddress,
        piMacAddress: piMacAddress
    }, {}, {
        $set: {
            ip: ip
        }
    }, function (err, result) {
        if (err) {
            console.log("[Handler] updateExistController (err): " + err);
        } else if (!result) {
            console.log("[Handler] updateExistController (!result): " + result);
        } else {
            console.log("[Handler] updateExistController (result): " + result);
        }
    });
}