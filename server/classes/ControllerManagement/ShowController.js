const mongoose = require('mongoose');
const knowController = mongoose.model('know_controller');

let ShowControllerData;

export default class ShowController {

    constructor(req, res) {
        this.operation(req, res);
    }

    async operation(req, res) {
        console.log("[ShowControllerData] session id: " + req.session.id);
        if (typeof req.session.farmData === "undefined" || typeof req.session.configFilePath === "undefined") {
            res.sendStatus(500);
            return;
        }

        
        // let farmId = req.body.farmId;
        // if (typeof farmId === "undefined") {
        //     res.json({
        //         status: 500,
        //         errorMessage: "เกิดข้อผิดพลาดในการเเสดงข้อมูลController ของฟาร์มนั้น"
        //     });
        //     return;
        // }

        await getControllerData(req.session.farmId);
        if (typeof ShowControllerData === "undefined") {
            res.json({
                status: 500,
                errorMessage: "เกิดข้อผิดพลาดไม่มีข้อมูล Controller"
            });
            return;
        }
        res.json(ShowControllerData);
    }

}

async function getControllerData(farmId) {
    await knowController.find({
        farmId: farmId
    }, (err, result) => {
        if (err) {
            ShowControllerData = undefined;
            console.log("[ShowControllerData] getControllerData (err):  " + err);
        } else if (!result) {
            ShowControllerData = undefined;
            console.log("[ShowControllerData getControllerData(!result): " + result);
        } else {
            ShowControllerData = result;
        }
    });
}