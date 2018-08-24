const mongoose = require('mongoose');
const knowController = mongoose.model('know_controller');

let ShowControllerData;

export default class ShowAllGreenHouseController {

    constructor(req, res) {
        this.operation(req, res);
    }

    async operation(req, res) {
        console.log("[ShowControllerData] session id: " + req.session.id);
        if (typeof req.session.farmData === "undefined" || typeof req.session.configFilePath === "undefined") {
            res.sendStatus(500);
            return;
        }
        let farmId = req.body.farmId;
        let controllerType = req.body.controllerType;

        if (typeof farmId === "undefined") {
            res.json({
                status: 500,
                errorMessage: "เกิดข้อผิดพลาดในการเเสดงข้อมูลคอนโทรลเลอร์ทั้งหมด"
            });
            return;
        }
        await getGreenHouseControllerData(farmId,controllerType);
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



async function getGreenHouseControllerData(farmId) {
    await knowController.find({
        farmId: farmId,
        controllerType:controllerType
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