const mongoose = require('mongoose');
const farm = mongoose.model('farm');

let showFarmDataResult = undefined;

export default class ShowFarm {

    constructor(req, res) {
        operation(req, res);
    }
}

async function operation(req, res) {

    console.log('[userDataResult] session id: ' + req.session.id);

    showFarmDataResult = await getFarmData();

    if (showFarmDataResult == null) {
        res.json({
            status: 500,
            errorMessage: "เกิดข้อผิดพลาดไม่มีข้อมูลFarm"
        });
        return;
    }
    res.json(showFarmDataResult);
}


async function getFarmData() {
    let result = await farm.find({
    }, (err, result) => {
        if (err) {
            showFarmDataResult = null;
            console.log('[FarmDataResult] getFarmData(err): ' + err);
        } else if (!result) {
            showFarmDataResult = null;
            console.log('[FarmDataResult] getFarmData(!result): ' + result);
        } else {
            showFarmDataResult = result;
        }
    });

    return result;
}