const mongoose = require('mongoose');
const growth_rate = mongoose.model('growth_rate');

let growthRateData;


export default class ShowActualRate {

    constructor(req, res) {
        this.operation(req, res);
    }

    async operation(req, res) {
        console.log('[ShowActualRate] session id: ' + req.session.id);
        if (typeof req.session.farmData === 'undefined' || typeof req.session.configFilePath === 'undefined') {
            res.sendStatus(401);
            return;
        }

        let projectId = req.body.projectId;
        if (typeof projectId === "undefined") {
            res.json({
                status: 500,
                errorMessage: "เกิดข้อผิดพลาดไม่มีประวัติเเสดงการเจริญเติบโต"
            });
            return;
        }

        growthRateData = await getGrowthRateData(req.session.farmId, projectId);
        if (growthRateData.length == 0) {
            res.json({
                status: 500,
                errorMessage: "เกิดข้อผิดพลาดไม่มีประวัติเเสดงการเจริญเติบโต"
            });
        }
        res.json(growthRateData);
    }
}


async function getGrowthRateData(farmId, projectId) {
    let result = await growth_rate.find({
        projectId: projectId
    }, null, {
        sort: {
            _id: 1
        }
    }, (err, result) => {
        if (err) {
            growthRateData = null;
            console.log('[ShowActualRate] getGrowthRateData (err): ' + err);
        } else if (!result) {
            growthRateData = null;
            console.log('[ShowActualRate] getGrowthRateData (!result):' + result);
        } else {
            growthRateData = result;
        }
    });
    return result;

}