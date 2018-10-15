const mongoose = require('mongoose');
const greenHouse = mongoose.model('greenHouse');

let greenHouseDataResult = undefined;


export default class ShowGreenHouse {

    constructor(req) {
        operation(req);
    }
}
async function operation(req, res) {

    console.log('[userDataResult] session id: ' + req.session.id);
    if (typeof req.session.farmData === "undefined" || typeof req.session.configFilePath === "undefined") {
        console.log(req.session.farmData + " / " + req.session.configFilePath)
        res.sendStatus(500);
        return;
    }

    let farmId = req.body.farmId;
    if (typeof farmId === "undefined") {
        res.json({
            status: 500,
            errorMessage: "เกิดข้อผิดพลาดในการเเสดงข้อมูลGreenHouseทั้งหมด"
        });
        return;
    }

    greenHouseDataResult = await getGreenHouseData(farmId);

    if (typeof greenHouseDataResult == "undefined") {
        res.json({
            status: 500,
            errorMessage: "เกิดข้อผิดพลาดไม่มีข้อมูลGreenHouse"
        });
        return;
    }
    res.json(greenHouseDataResult);
}






async function getGreenHouseData(farmId) {
    let result = await greenHouse.findOne({
        farmId: farmId,
    }, (err, result) => {
        if (err) {
            greenHouseDataResult = undefined;
            console.log('[greenHouseDataResult] getGreenHouseData(err): ' + err);
        } else if (!result) {
            greenHouseDataResult = undefined;
            console.log('[greenHouseDataResult] getGreenHouseData(!result): ' + result);
        } else {
            greenHouseDataResult = result;
        }
    });
    return result;
}