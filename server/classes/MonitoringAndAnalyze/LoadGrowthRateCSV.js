const mongoose = require('mongoose');
const growth_rate = mongoose.model('growth_rate');

let growthRateData = undefined;


export default class LoadGrowthRateCSV {

    constructor(req, res) {
        this.operation(req, res);
    }

    async operation(req, res) {
        console.log('[LoadGrowthRateCSV] session id: ' + req.session.id);
        if (typeof req.session.farmData === 'undefined' || typeof req.session.configFilePath === 'undefined') {
            res.sendStatus(401);
            return;
        }

        let farmId = req.session.farmId;
        let greenHouseId = req.body.greenHouseId ? req.body.greenHouseId : {
            $ne: null
        };
        let projectId = req.body.projectId ? req.body.projectId : {
            $ne: null
        };
        let growthData = await getGrowthRateData(farmId, greenHouseId, projectId);
        if (typeof growthRateData === 'undefined') {
            res.json({
                status: 500,
                errorMessage: "เกิดข้อผิดพลาดในการดึงข้อมูลกรุณาลองใหม่อีกครั้ง"
            });
        }
        res.json(growthRateData);
    }
}


async function getGrowthRateData(farmId, greenHouseId, projectId) {
    let result = await growth_rate.find({
        farmId: farmId,
        greenHouseId: greenHouseId,
        projectId: projectId
    }, null, {
        sort: {
            timeStamp: 1
        }
    }, (err, result) => {
        if (err) {
            growthRateData = null;
            console.log('[LoadGrowthRateCSV] getGrowthRateData (err): ' + err);
        } else if (!result) {
            growthRateData = null;
            console.log('[LoadGrowthRateCSV] getGrowthRateData (!result):' + result);
        } else {
            growthRateData = result;
        }
    })
    return result;

}