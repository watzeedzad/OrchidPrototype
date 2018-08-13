const mongoose = require("mongoose");
const knowController = mongoose.model("know_controller");
const farm = mongoose.model("farm");

export default class HandleIpPool {
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
        for (let index = 0; index < ipPoolData.length; index++) {
            let indexData = String(ipPoolData[index]);
            indexData = indexData.split(" ");
            let ip = indexData[1];
            let macAddress = indexData[2];
            
        }
    }
}

async function insertKnowController(ip, macAddress, piMacAddress) {
    await knowController
}

async function findExistController() {

}

async function getFarmData(piMacAddress) {
    await farm.findOne({
        
    })
}