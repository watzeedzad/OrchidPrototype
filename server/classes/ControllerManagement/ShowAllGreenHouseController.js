const mongoose = require('mongoose');
const knowController = mongoose.model('know_controller');

let showGreenHouseControllerData = undefined;

export default class ShowAllGreenHouseController {

    constructor(req, res) {
        process(req, res);
    }
}

async function process(req) {
    console.log("[ShowAllGreenHouseController] session id: " + req.session.id);
    if (typeof req.session.farmData === "undefined" || typeof req.session.configFilePath === "undefined") {
        console.log(req.session.farmData + " / " + req.session.configFilePath)
        res.sendStatus(401);
        return;
    }
    let farmId = req.session.farmId;
    let greenHouseId = req.body.greenHouseId;

    if (typeof farmId === "undefined") {
        res.json({
            status: 500,
            errorMessage: "เกิดข้อผิดพลาดในการเเสดงข้อมูลGreenHouseControllerทั้งหมด"
        });
        return;
    }

    showGreenHouseControllerData = await getGreenHouseControllerData(farmId, greenHouseId);

    if (showGreenHouseControllerData == null) {
        res.json({
            status: 500,
            errorMessage: "เกิดข้อผิดพลาดในการเเสดงข้อมูลGreenHouseControllerทั้งหมด"
        });
        return;

    } else if (showGreenHouseControllerData.length == 0) {
        res.json({
            status: 500,
            errorMessage: "เกิดข้อผิดพลาดไม่มีข้อมูลGreenHouse Controller"
        });
        return;
    }

    showGreenHouseControllerData.sort(function (a, b) {
        return a.greenHouseId - b.greenHouseId
    });

    res.json(showGreenHouseControllerData);
}





async function getGreenHouseControllerData(farmId, greenHouseId) {
    let result = await knowController.findOne({
        farmId: farmId,
        greenHouseId: greenHouseId,
        projectId: null
    }, (err, result) => {
        if (err) {
            showGreenHouseControllerData = null;
            console.log("[ShowAllGreenHouseController] getControllerData (err):  " + err);
        } else if (!result) {
            showGreenHouseControllerData = null;
            console.log("[ShowAllGreenHouseController] getControllerData(!result): " + result);
        } else {
            showGreenHouseControllerData = result;
        }
    });

    return result;
}