const mongoose = require("mongoose");
const relayManualQueue = mongoose.model("relay_manual_queue");
let ObjectID = require("mongodb").ObjectID;

export default class InsertRelayManualCommand {
    constructor(ip, pumpType, macAddress, litre) {
        this.process(ip, pumpType, macAddress, litre);
    }

    async procces(ip, pumpType, macAddress, litre) {
        let relayInsertData = {
            _id: new ObjectID(),
            pumpType: pumpType,
            ip: ip,
            litre: litre,
            piMacAddress: macAddress
        }
        relayManualQueue.insert(relayInsertData);
    }
}