const mongoose = require('mongoose');
const knowController = mongoose.model('know_controller');

let controllerNotAssignData;

export default class GetDropdownController {

    constructor(req, res) {
        this.operation(req, res);
    }

    async operation(req, res) {
        console.log("[GetDropdownController] session id: " + req.session.id);
        if (typeof req.session.farmData === "undefined" || typeof req.session.configFilePath === "undefined") {
            console.log(req.session.farmData + " / " + req.session.configFilePath)
            res.sendStatus(401);
            return;
        }
        let farmId = req.session.farmId;

        if (typeof farmId === "undefined") {
            res.json({
                status: 500,
                errorMessage: "เกิดข้อผิดพลาดในการนําข้อมูลใส่Dropdownทั้งหมด"
            });
            return;
        }

        controllerNotAssignData = await getNotAssignControllerData(farmId);

        if (controllerNotAssignData.length == 0) {
            res.json({
                status: 500,
                errorMessage: "เกิดข้อผิดพลาดไม่มีข้อมูล Controller"
            });
            return;
        }
        res.json(controllerNotAssignData)
    }
}

async function getNotAssignControllerData(farmId) {
    let result = await knowController.find({
        farmId: farmId,
        greenHouseId: null

    }, (err, result) => {
        if (err) {
            controllerNotAssignData = null;
            console.log('[GetDropdownController] getNotAssignControllerData (err)' + err);
        } else if (!result) {
            controllerNotAssignData = null;
            console.log('[GetDropdownController] getNotAssignControllerData (err)' + doc);
        } else {
            controllerNotAssignData = result;
        }
    });
    return result;
}