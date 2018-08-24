const mongoose = require("mongoose");
const knowController = mongoose.model('know_controller');

let showProjectControllerData;

export default class showAllProjectController {

    constructor(req, res) {
        this.operation(req, res);
    }

    async operation(req, res) {
        console.log("[showGreenHouseControllerData] session id: " + req.session.id);
        if (typeof req.session.farmData === "undefined" || typeof req.session.configFilePath === "undefined") {
            res.sendStatus(500);
            return;
        }

        let framId = req.body.farmId;
        let controllerType = req.body.controllerType;

        if (typeof farmId === "undefined") {
            res.json({
                status: 500,
                errorMessage: "เกิดข้อผิดพลาดในการเเสดงข้อมูลProject Controllerทั้งหมด"
            });
            return;
        }

        await getProjectControllerData(farmId, controllerType);
        if (typeof showProjectControllerData === "undefined") {
            res.json({
                status: 500,
                errorMessage: "เกิดข้อผิดพลาดไม่มีข้อมูลProject Controller"
            });
            return;
        }
        res.json(showProjectControllerData);
    }

}

async function getProjectControllerData(farmId, controllerType) {
    await knowController.find({
        farmId: farmId,
        controllerType: controllerType
    }, (err, result) => {
        if (err) {
            projectControllerData = undefined;
            console.log("[showProjectControllerData] getProjectControllerData(err): " + err);
        } else if (!result) {
            projectControllerData = undefined;
            console.log("[showProjectControllerData] getProjectControllerData(!result): " + result);
        } else {
            showProjectControllerData = result;
        }
    });
}