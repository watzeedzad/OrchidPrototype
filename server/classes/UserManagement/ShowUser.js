const mongoose = require('mongoose');
const user = mongoose.model('user');


let userDataResult;

export default class ShowUser {

    constructor(req, res) {
        operation(req, res);
    }
}
async function operation(req, res) {

    console.log("[ShowUser] session id: " + req.session.id);
    if (typeof req.session.farmData === "undefined" || typeof req.session.configFilePath === "undefined") {
        console.log(req.session.farmData + " / " + req.session.configFilePath)
        res.sendStatus(401);
        return;
    }

    let farmId = req.session.farmId;
    if (typeof farmId === "undefined") {
        res.json({
            status: 500,
            errorMessage: "เกิดข้อผิดพลาดในการเเสดงข้อมูลUserทั้งหมด"
        });
        return;
    }

    userDataResult = await getUserData(farmId);

    // if (userDataResult.length == 0) {
    //     res.json({
    //         status: 500,
    //         errorMessage: "เกิดข้อผิดพลาดไม่มีข้อมูลUser"
    //     });
    //     return;
    // }
    res.json(userDataResult);

}


async function getUserData(farmId) {
    let result = await user.find({
        farmId: farmId,
    }, (err, result) => {
        if (err) {
            userDataResult = null;
            console.log('[userDataResult] getUserData(err): ' + err);
        } else if (!result) {
            userDataResult = null;
            console.log('[userDataResult] getUserData(!result): ' + result);
        } else {
            userDataResult = result;
        }
    });
    return result;
}