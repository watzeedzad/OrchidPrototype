const mongoose = require('mongoose');
const user = mongoose.model('user');


let userDataResult;

export default class SearchUser {

    constructor(req, res) {
        this.operation(req, res);
    }

    async operation(req, res) {

        console.log("[SearchUser] session id: " + req.session.id);
        if (typeof req.session.farmData === "undefined" || typeof req.session.configFilePath === "undefined") {
            console.log(req.session.farmData + " / " + req.session.configFilePath)
            res.sendStatus(401);
            return;
        }

        let farmId = req.body.farmId;
        let term = req.body.term;

        if (typeof farmId === "undefined") {
            res.json({
                status: 500,
                errorMessage: "เกิดข้อผิดพลาดในการเเสดงข้อมูลUserทั้งหมด"
            });
            return;
        }

        userDataResult = await getUserData(farmId,term);
            console.log(userDataResult)
            if (userDataResult == null) {
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
    let result = await user.find({
        farmId: farmId,
        $or: [{ firstname: {'$regex':term} },
            { lastname: {'$regex':term} },
            { username: {'$regex':term} }],

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