const mongoose = require('mongoose');
const growth_rate = mongoose.model('growth_rate');

let growthRateData = undefined;


export default class LoadCompareGrowthRate {

    constructor(req, res) {
        this.operation(req, res);
    }

    async operation(req, res) {
        console.log('[LoadCompareGrowthRate] session id: ' + req.session.id);
        if (typeof req.session.farmData === 'undefined' || typeof req.session.configFilePath === 'undefined') {
            res.sendStatus(401);
            return;
        }

        let projectId = req.body.projectId ? req.body.projectId : {
            $ne: null
        };
        
        let growthData = await getGrowthRateData(projectId);
        if (typeof growthRateData === 'undefined') {
            res.json({
                status: 500,
                errorMessage: "เกิดข้อผิดพลาดในการดึงข้อมูลกรุณาลองใหม่อีกครั้ง"
            });
        }
        res.json(growthData);
    }
}


async function getGrowthRateData(projectId) {
    let result = await growth_rate.find({
        projectId: projectId
    }, null, {
        sort: {
            timeStamp: 1
        }
    }, (err, result) => {
        if (err) {
            growthRateData = null;
            console.log('[LoadCompareGrowthRate] getGrowthRateData (err): ' + err);
        } else if (!result) {
            growthRateData = null;
            console.log('[LoadCompareGrowthRate] getGrowthRateData (!result):' + result);
        } else {
            growthRateData = result;
        }
    })
    return result;

}