const mongoose = require("mongoose");
const relayManualQueue = mongoose.model("relay_manual_queue");
let ObjectID = require("mongodb").ObjectID;

export default class InsertRelayManualCommand {
    constructor(ip, pumpType, macAddress, litre) {
        this.operation(ip, pumpType, macAddress, litre);
    }

    async operation(ip, pumpType, macAddress, litre) {
        let relayInsertData = {
            _id: new ObjectID(),
            pumpType: pumpType,
            ip: ip,
            inputLitre: litre,
            piMacAddress: macAddress
        }
        new relayManualQueue(relayInsertData).save(function (err) {
            console.log(err);
            if (!err) {
                console.log("[InsertRelayManualCommand] params: " + ip, pumpType, macAddress, litre);
                console.log("[InsertRelayManualCommand] created command!");
            } else {
                //TODO: return page with errors
                return console.log(err);
            }
        });
    }
}