const mongoose = require("mongoose");
const knowController = mongoose.model("know_controller");

let editControllerResult;

export default class EditController {
    constructor(req, res) {
        this.operation(req, res);
    }

    async operation(req, res) {
        // let ip = req.body.ip;
        let macAddress = req.body.mac_address;
        let name = req.body.name;
        let projectId = req.body.projectId;
        let greenHouseId = req.body.greenHouseId;
        let farmId = req.body.farmId;
        
        let isHavePump = req.body.isHavePump=='0'?true:false;
        let moisture;
        let water;
        let fertilizer;
        
        if (isHavePump === false) {
            moisture = false;
            water = false;
            fertilizer = false;
        } else {
            moisture = req.body.moisture=='0'||req.body.moisture==true?true:false;
            water = req.body.water=='0'||req.body.water==true?true:false;
            fertilizer = req.body.fertilizer=='0'||req.body.fertilizer==true?true:false;
        }
        console.log(moisture+" "+water+" "+fertilizer)
        await editControllerData(farmId,greenHouseId,projectId,name,isHavePump, moisture, water, fertilizer,macAddress);

        if(editControllerData){
            res.sendStatus(200);
        }else{
            res.sendStatus(500);
        }
    }
}

async function editControllerData(farmId,greenHouseId,projectId,name,isHavePump, moisture, water, fertilizer,macAddress) {
    knowController.findOneAndUpdate({
            //ip: ip,
            macAddress: macAddress,
            //piMacAddress: piMacAddress
        }, {
            $set: {
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
                //piMacAddress: piMacAddress
            }
        },
        function (err, doc) {
            if (err) {
                editControllerResult = false;
                console.log("[EditController] editControllerData (err): " + err);
            } else if (!doc) {
                editControllerResult = false;
                console.log("[EditController] editControllerData (!doc): " + doc);
            } else {
                editControllerResult = true;
            }
        }
    );
}