const mongoose = require('mongoose');
const greenHouse = mongoose.model('greenHouse');

let showGreenHouseData = undefined;

export default class ShowAllGreenHouseController {

    constructor(req, res) {
        process(req, res);
    }
}

async function process(req) {
    console.log("[showGreenHouse] session id: " + req.session.id);
    if (typeof req.session.farmData === "undefined" || typeof req.session.configFilePath === "undefined") {
        console.log(req.session.farmData + " / " + req.session.configFilePath)
        res.sendStatus(500);
        return;
    }
    let farmId = req.session.farmId;

    if (typeof farmId === "undefined") {
        res.json({
            status: 500,
            errorMessage: "เกิดข้อผิดพลาดในการเเสดงข้อมูลGreenHouseทั้งหมด"
        });
        return;
    }

    showGreenHouseData = await getGreenHouseData(farmId);

    if (typeof showGreenHouseData === "undefined") {
        res.json({
            status: 500,
            errorMessage: "เกิดข้อผิดพลาดในการเเสดงข้อมูลGreenHouseทั้งหมด"
        });
        return;
    } else if (showGreenHouseData.length == 0) {
        res.json({
            status: 500,
            errorMessage: "เกิดข้อผิดพลาดไม่มีข้อมูลGreenHouse"
        });
        return;
    }

    showGreenHouseData.sort(function (a, b) {
        return a.greenHouseId - b.greenHouseId
    });

    res.json(showGreenHouseData);

}



async function getGreenHouseData(farmId) {
    let result = await greenHouse.findOne({
        farmId: farmId,
    }, (err, result) => {
        if (err) {
            showGreenHouseData = undefined;
            console.log("[showGreenHouse] showGreenHouseData (err):  " + err);
        } else if (!result) {
            showGreenHouseData = undefined;
            console.log("[showGreenHouse] showGreenHouseData(!result): " + result);
        } else {
            showGreenHouseData = result;
        }
    });
    return result;
}