const mongoose = require("mongoose");
const know_controller = mongoose.model("know_controller");

export default class CreateController {
    constructor(req, res) {
        this.operation(req, res);
    }

    async operation(req, res) {
        await saveControllerData();
        res.sendStatus(200);
    }
}

function saveControllerData() {
    const newKnowControllerData = {
        ip: "192.168.1.12",
        mac_address: "12:48:AF:87:FD:58",
        name: "Proto_Board01",
        projectId: 1,
        greenHouseId: 789456123,
        farmId: 123456789,
        pumpType: {
            moisture: true,
            water: true,
            fertilizer: true
        },
        isHavePump: true,
        piMacAddress: "b8,27,eb,a7,78,ad"
    }

    new know_controller(newKnowControllerData).save(function (err) {
        if (!err) {
            console.log("[CreateControoler] created new controller!");
          } else {
            //TODO: return page with errors
            return console.log(err);
          }
    });
}