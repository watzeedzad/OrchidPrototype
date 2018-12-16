const mongoose = require('mongoose');
const greenHouse = mongoose.model('greenHouse');

let showGreenHouseData = undefined;

export default class ShowAllGreenHouseController {

    constructor(req, res) {
        process(req, res);
    }
}

async function process(req, res) {
    console.log("[ShoWAllGreenHouse] session id: " + req.session.id);
    if (typeof req.session.farmData === "undefined" || typeof req.session.configFilePath === "undefined") {
        console.log(req.session.farmData + " / " + req.session.configFilePath)
        res.sendStatus(401);
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

    if (showGreenHouseData == null) {
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

    // showGreenHouseData.sort(function (a, b) {
    //     return a.greenHouseId - b.greenHouseId
    // });

    res.json(showGreenHouseData);

}



async function getGreenHouseData(farmId) {
    let result = await greenHouse.find({
        farmId: farmId,
    }, null, {
        sort: {
            greenHouseId: 1
        }
    }, (err, result) => {
        if (err) {
            showGreenHouseData = null;
            console.log("[ShoWAllGreenHouse] showGreenHouseData (err):  " + err);
        } else if (!result) {
            showGreenHouseData = null;
            console.log("[ShoWAllGreenHouse] showGreenHouseData(!result): " + result);
        } else {
            showGreenHouseData = result;
        }
    });
    return result;
}