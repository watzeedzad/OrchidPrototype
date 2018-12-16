const mongoose = require("mongoose");
const knowController = mongoose.model("know_controller");
const farm = mongoose.model("farm");

let farmDataResult;
let knowControllerDataResult;

export default class Handler {
    constructor(req, res) {
        operation(req, res);
    }
}

async function operation(req, res) {
    let ipPoolDataTemp = req.body.ipPoolData;
    // let ipPooldataTemp = req.body.ipPoolData;
    let piMacAddress = req.body.piMacAddress;
    // console.log(ipPooldataTemp, piMacAddress);
    if (typeof ipPoolDataTemp === "undefined" || typeof piMacAddress === "undefined") {
        res.sendStatus(500);
        return;
    }
    let newFormatPiMacAddress;
    console.log("[Handler] ipPoolDataTemp : " + ipPoolDataTemp);
    console.log("[Handler] piMacAddress : " + piMacAddress);
    let splitChar = piMacAddress[2];
    newFormatPiMacAddress = (piMacAddress.split(splitChar)).toString();
    newFormatPiMacAddress = newFormatPiMacAddress.toLowerCase();
    console.log("[Handler] newFormatPiMacAddress : " + newFormatPiMacAddress);
    farmDataResult = await getFarmData(newFormatPiMacAddress);
    if (farmDataResult == null) {
        res.sendStatus(500);
        return;
    }
    // if (typeof ipPooldataTemp === "string") {
    //     ipPoolData = [];
    //     ipPoolData.push(ipPooldataTemp);
    // } else {
    //     ipPoolData = ipPooldataTemp;
    // }
    let status;
    let ipPoolData = ipPoolDataTemp[0].substring(1, ipPoolDataTemp[0].length - 1);
    ipPoolData = ipPoolData.split(", ")
    console.log("[Handler] ipPoolData.length : " + ipPoolData.length);
    for (let index = 0; index < ipPoolData.length; index++) {
        let indexData = ipPoolData[index];
        console.log("[Handler] indexData : " + indexData);
        indexData = indexData.split(" ");
        let ip = indexData[2];
        let macAddress = indexData[1];
        knowControllerDataResult = await findExistController(macAddress, newFormatPiMacAddress, farmDataResult.farmId);
        if (knowControllerDataResult == null) {
            console.log("[Handler] begin insert new controller " + ip, macAddress)
            await insertKnowController(ip, macAddress, newFormatPiMacAddress, farmDataResult.farmId, function (insertKnowControllerResult) {
                if (insertKnowControllerResult) {
                    status = true;
                } else {
                    status = false;
                }
            });
        } else {
            if (knowControllerDataResult.ip != ip) {
                console.log("[Handler] begin update controller ip " + ip, macAddress, knowControllerDataResult.ip);
                await updateExistController(knowControllerDataResult._id, ip, knowControllerDataResult, function (updateExistControllerResult) {
                    if (updateExistControllerResult) {
                        status = true;
                    } else {
                        status = false;
                    }
                });
            } else {
                console.log("[Handler] ip won't cahnge")
            }
        }
    }
    if (typeof status === "undefined") {
        res.sendStatus(200);
    } else {
        if (status) {
            res.sendStatus(200);
        } else {
            res.sendStatus(500);
        }
    }
}

async function insertKnowController(ip, macAddress, piMacAddress, farmId, callback) {
    let insertKnowControllerResult = null;

    let insertData = {
        ip: ip,
        mac_address: macAddress,
        farmId: farmId,
        piMacAddress: piMacAddress
    }
    await knowController(insertData).save(function (err) {
        if (!err) {
            insertKnowControllerResult = true;
            console.log("[Handler] insertKnowController (!err): insert new controller!")
        } else {
            insertKnowControllerResult = false;
            console.log("[Handler] insertKnowController (err): " + err);
        }
        callback(insertKnowControllerResult);
    });
}

async function findExistController(macAddress, piMacAddress, farmId) {
    let result = await knowController.findOne({
        mac_address: macAddress,
        piMacAddress: piMacAddress,
        farmId: farmId
    }, (err, result) => {
        if (err) {
            knowControllerDataResult = null;
            console.log("[Handler] findExistController (err): " + err);
        } else if (!result) {
            knowControllerDataResult = null;
            console.log("[Handler] findExistController (!result): " + result);
        } else {
            knowControllerDataResult = result;
            console.log("[Handler] findExistController (result): " + result);
        }
    });
    return result;
}

async function getFarmData(piMacAddress) {
    let result = await farm.findOne({
        piMacAddress: piMacAddress
    }, (err, result) => {
        if (err) {
            farmDataResult = null;
            console.log("[Handler] getFarmData (err): " + err);
        } else if (!result) {
            farmDataResult = null;
            console.log("[Handler] getFarmData (!result): " + result);
        } else {
            farmDataResult = result;
            console.log("[Handler] getFarmData (result): " + result)
        }
    });
    return result;
}

async function updateExistController(macAddress, ip, piMacAddress, callback) {
    let updateExistControllerResult = null;

    await knowController.findOneAndUpdate({
        mac_address: macAddress,
        piMacAddress: piMacAddress
    }, {}, {
        $set: {
            ip: ip
        }
    }, function (err, result) {
        if (err) {
            console.log("[Handler] updateExistController (err): " + err);
            updateExistControllerResult = false;
        } else if (!result) {
            console.log("[Handler] updateExistController (!result): " + result);
            updateExistControllerResult = false;
        } else {
            console.log("[Handler] updateExistController (result): " + result);
            updateExistControllerResult = true;
        }
        callback(updateExistControllerResult);
    });
}