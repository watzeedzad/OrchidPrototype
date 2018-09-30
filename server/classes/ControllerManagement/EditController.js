const mongoose = require("mongoose");
const knowController = mongoose.model("know_controller");

let editControllerResult;

export default class EditController {
    constructor(req, res) {
        this.operation(req, res);
    }

    async operation(req, res) {
        // let ip = req.body.ip;
        let macAddress
        if(req.body.mac_address.value){
            macAddress = req.body.mac_address.value
        }else{
            macAddress = req.body.mac_address
        }
        let name = req.body.name;
        let projectId = req.body.projectId;
        let greenHouseId = req.body.greenHouseId;
        let farmId = req.session.farmId;
        
        let isHaveRelay = req.body.isHaveRelay === '0'||req.body.isHaveRelay===true?true:false;
        let moisture;
        let water;
        let fertilizer;
        let light;
        
        if (isHaveRelay === false) {
            moisture = false;
            water = false;
            fertilizer = false;
            light = false;
        } else {
            moisture = req.body.moisture==='0'||req.body.moisture===true?true:false;
            water = req.body.water==='0'||req.body.water===true?true:false;
            fertilizer = req.body.fertilizer==='0'||req.body.fertilizer===true?true:false;
            light = req.body.light==='0'||req.body.light===true?true:false;
        }

        await editControllerData(farmId,greenHouseId,projectId,name,isHaveRelay, moisture, water, fertilizer,light,macAddress);

        if(editControllerData){
            res.sendStatus(200);
        }else{
            res.sendStatus(500);
        }
    }
}

async function editControllerData(farmId,greenHouseId,projectId,name,isHaveRelay, moisture, water,fertilizer, light ,macAddress) {
    knowController.findOneAndUpdate({
            //ip: ip,
            mac_address: macAddress,
            //piMacAddress: piMacAddress
        }, {
            $set: {
                name: name,
                projectId: projectId,
                greenHouseId: greenHouseId,
                farmId: farmId,
                relayType: {
                    moisture: moisture,
                    water: water,
                    fertilizer: fertilizer,
                    light: light
                },
                isHaveRelay: isHaveRelay,
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