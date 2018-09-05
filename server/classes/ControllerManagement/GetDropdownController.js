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
            console.log(req.session.farmData+" / "+req.session.configFilePath)
            res.sendStatus(500);
            return;
        }
        let farmId = req.body.farmId;

        if (typeof farmId === "undefined") {
            res.json({
                status: 500,
                errorMessage: "เกิดข้อผิดพลาดในการนําข้อมูลใส่Dropdownทั้งหมด"
            });
            return;
        }

        await getNotAssignControllerData(farmId);

        if (typeof controllerNotAssignData === "undefined") {
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
    await knowController.find({
        farmId: farmId,
        greenHouseId: null
        
    }, (err, result) => {
        if (err) {
            controllerNotAssignData = undefined;
            console.log('[GetDropdownController] getNotAssignControllerData (err)' + err);
        } else if (!result) {
            controllerNotAssignData = undefined;
            console.log('[GetDropdownController] getNotAssignControllerData (err)' + doc);
        } else {
            controllerNotAssignData = result;
        }
    })
}