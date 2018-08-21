const mongoose = require("mongoose");
const know_controller = mongoose.model("know_controller");

export default class CreateController {
    constructor(req, res) {
        this.operation(req, res);
    }

    async operation(req, res) {
        let ip = req.body.ip;
        let macAddress = req.body.mac_address;
        let name = req.body.name;
        let projectId = req.body.projectId;
        let greenHouseId = req.body.greenHouseId;
        let farmId = req.body.farmId;

        let isHavePump = req.body.isHavePump;
        let moisture;
        let water;
        let fertilizer;
        
        if(isHavePump === false){
            moisture = false;
            water = false;
            fertilizer = false;
        }else{
            moisture = req.body.moisture;
            water = req.body.water;
            fertilizer = req.body.fertilizer;
        }
        
        await saveControllerData(ip,macAddress,name,projectId,greenHouseId,farmId,moisture,water,fertilizer);
        res.sendStatus(200);
    }
}

async function saveControllerData(ip,macAddress,name,projectId,greenHouseId,farmId,moisture,water,fertilizer,isHavePump,piMacAddress) {
    const newKnowControllerData = {
        ip: ip,
        mac_address: macAddress,
        name: name,
        projectId: projectId,
        greenHouseId: greenHouseId,
        farmId: farmId,
        pumpType: {
            moisture: moisture,
            water: water,
            fertilizer: fertilizer
        },
        isHavePump: isHavePump,
        piMacAddress: piMacAddress
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