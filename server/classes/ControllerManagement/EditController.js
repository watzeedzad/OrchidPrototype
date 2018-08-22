const mongoose = require("mongoose");
const knowController = mongoose.model("know_controller");

let editControllerResult;

export default class EditController {
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

        if (isHavePump === false) {
            moisture = false;
            water = false;
            fertilizer = false;
        } else {
            moisture = req.body.moisture;
            water = req.body.water;
            fertilizer = req.body.fertilizer;
        }

        await editControllerData(ip,macAddress, name, projectId, greenHouseId, farmId, isHavePump, moisture, water, fertilizer);

        if(editControllerData){
            res.sendStatus(200);
        }else{
            res.sendStatus(500);
        }
    }
}

async function editControllerData(ip,macAddress, name, projectId, greenHouseId, farmId, isHavePump, moisture, water, fertilizer) {
    knowController.findOneAndUpdate({
            ip: ip,
            macAddress: macAddress,
            piMacAddress: piMacAddress
        }, {
            $set: {
                name: name,
                projectId: projectId,
                greenHouseId: greenHouseId,
                farmId: farmId,
                pumpType: {
                    moisture: moisture,
                    water: water,
                    fertilizer,
                    fertilizer
                },
                isHavePump: isHavePump,
                piMacAddress: piMacAddress
            }
        },
        function (err, doc) {
            if (err) {
                editControllerResult = false;
                console.log("[EditController] findAndUpdateController (err): " + err);
            } else if (!doc) {
                editControllerResult = false;
                console.log("[EditController] findAndUpdateController (!doc): " + doc);
            } else {
                editControllerData = true;
            }
        }
    );
}