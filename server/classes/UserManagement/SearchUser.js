const mongoose = require('mongoose');
const user = mongoose.model('user');


let userDataResult;

export default class SearchUser {

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
        let term = req.body.term;

        console.log(farmId+"/"+term)
        if (typeof farmId === "undefined") {
            res.json({
                status: 500,
                errorMessage: "เกิดข้อผิดพลาดในการเเสดงข้อมูลUserทั้งหมด"
            });
            return;
        }

        await getUserData(farmId,term);
        console.log(userDataResult)
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

async function getUserData(farmId,term) {
    await user.find({
        farmId: farmId,
        $or: [{ firstname: {'$regex':term} },
            { lastname: {'$regex':term} },
            { username: {'$regex':term} }],

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