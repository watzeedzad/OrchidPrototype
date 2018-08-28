const mongoose = rqeuire('mongoose');
const user = mongoose.model('user');


let userDataResult;

export default class ShowUser {

    constructor(req, res) {
        this.operation(req, res);
    }

    async operation(req, res) {

        console.log("[userDataResult] session id: " + req.session.id);
        if (typeof req.session.farmData === "undefined" || typeof req.session.configFilePath === "undefined") {
            console.log(req.session.farmData + " / " + req.session.configFilePath)
            res.sendStatus(500);
            return;
        }

        let farmId = req.body.farmId;
        if (typeof farmId === "undefined") {
            res.json({
                status: 500,
                errorMessage: "เกิดข้อผิดพลาดในการเเสดงข้อมูลUserทั้งหมด"
            });
            return;
        }

        await getUserData(farmId);

        if (typeof userDataResult == "undefined") {
            res.json({
                status: 500,
                errorMessage: "เกิดข้อผิดพลาดไม่มีข้อมูลUser"
            });
            return;
        }
        res.json(userDataResult);
    }
}

async function getUserData(farmId) {
    await user.find({
        farmId: farmId,
    }, (err, result) => {
        if (err) {
            userDataResult = undefined;
            console.log('[userDataResult] getUserData(err): ' + err);
        } else if (!result) {
            userDataResult = undefined;
            console.log('[userDataResult] getUserData(!result): ' + result);
        } else {
            userDataResult = result;
        }
    })
}