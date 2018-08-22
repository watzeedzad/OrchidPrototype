const mongoose = require("mongoose");
const knowcontroller = mongoose.model("know_controller");

let deleteControllerResult;

export default class CreateController {
    constructor(req, res) {
        this.operation(req, res);
    }

    async operation(req, res) {
        
        let ip = req.body.ip;
        let macAddress = req.body.macAddress;
        let piMacAddress = req.body.piMacAddress;

        await findAndDeleteController(ip,macAddress,piMacAddress);
        if(deleteControllerResult){
            res.sendStatus(200);
        }else{
            res.sendStatus(500);
        }
    }
}

async function findAndDeleteController(ip, macAddress, piMacAddress) {
    knowcontroller.findOneAndRemove({
            ip: ip,
            macAddress: macAddress,
            piMacAddress: piMacAddress
        },
        function (err, doc) {
            if (err) {
                deleteControllerResult = false;
                console.log("[deleteControllerResult] findAndDeleteController(err):  " + err);
            }else if(!doc){
                deleteControllerResult = false;
                console.log("[deleteControllerResult] findAndDeleteController(!doc):  " + doc);
            }else{
                deleteControllerResult = true;
            }
        }
    );
}