const mongoose = require("mongoose");
const relayQueue = mongoose.model("relay_queue");
let ObjectID = require("mongodb").ObjectID;

export default class InsertRelayCommand {
    constructor(ip, pumpType, command, macAddress) {
        this.process(ip, pumpType, command, macAddress);
    }

    async process(ip, pumpType, command, macAddress) {
        let relayInsertData = {
            _id: new ObjectID(),
            pumpType: pumpType,
            ip: ip,
            command: command,
            macAddress: macAddress
        }
        new relayQueue(relayInsertData).save(function (err) {
            if (!err) {
                console.log("[InsertRelayCommand] created command!");
            } else {
                //TODO: return page with errors
                return console.log(err);
            }
        });
    }
}