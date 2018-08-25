const mongoose = require('mongoose');
const knowController = mongoose.model('know_controller');

let showGreenHouseControllerData;

export default class ShowAllGreenHouseController {

    constructor(req, res) {
        this.process(req, res);
    }

    async process(req, res) {
        console.log("[showGreenHouseControllerData] session id: " + req.session.id);
        if (typeof req.session.farmData === "undefined" || typeof req.session.configFilePath === "undefined") {
            console.log(req.session.farmData+" / "+req.session.configFilePath)
            res.sendStatus(500);
            return;
        }
        let farmId = req.body.farmId;
        let controllerType = req.body.controllerType;

        if (typeof farmId === "undefined") {
            res.json({
                status: 500,
                errorMessage: "เกิดข้อผิดพลาดในการเเสดงข้อมูลGreenHouseControllerทั้งหมด"
            });
            return;
        }
        await getGreenHouseControllerData(farmId,controllerType);
        if (typeof showGreenHouseControllerData === "undefined") {
            res.json({
                status: 500,
                errorMessage: "เกิดข้อผิดพลาดไม่มีข้อมูลGreenHouse Controller"
            });
            return;
        }
        res.json(showGreenHouseControllerData);
    }

}



async function getGreenHouseControllerData(farmId,controllerType) {
    await knowController.find({
        farmId: farmId,
        controllerType:controllerType
    }, (err, result) => {
        if (err) {
            showGreenHouseControllerData = undefined;
            console.log("[showGreenHouseControllerData] getControllerData (err):  " + err);
        } else if (!result) {
            showGreenHouseControllerData = undefined;
            console.log("[showGreenHouseControllerData getControllerData(!result): " + result);
        } else {
            showGreenHouseControllerData = result;
        }
    });
}