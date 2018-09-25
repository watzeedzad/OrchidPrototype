const mongoose = require('mongoose');
const growth_rate = mongoose.model('growth_rate');

let growthRateData = undefined;


export default class LoadGrowthRateCSV {

    constructor(req, res) {
        this.operation(req, res);
    }

    async operation(req, res) {
        console.log('[LoadGrowthRateCSV] session id: '+req.session.id);
        if(typeof req.session.farmData === 'undefined' || typeof req.session.configFilePath ==='undefined'){
            res.sendStatus(500);
            return;
        }

        let farmId = req.session.farmId;
        let greenHouseId = req.body.greenHouseId?req.body.greenHouseId:{$ne:null};
        let projectId = req.body.projectId?req.body.projectId:{$ne:null};
        console.log(farmId,greenHouseId,projectId)
        await getGrowthRateData(farmId,greenHouseId,projectId);
        setTimeout(() => {
            if(typeof growthRateData ==='undefined' ){
                res.json({
                    status:500,
                    errorMessage:"เกิดข้อผิดพลาดในการดึงข้อมูลกรุณาลองใหม่อีกครั้ง"
                });
            }
            console.log(growthRateData)
            res.json(growthRateData);
        }, 200)
    }
}


async function getGrowthRateData(farmId,greenHouseId,projectId) {
    await growth_rate.find({
        farmId: farmId,
        greenHouseId: greenHouseId,
        projectId: projectId
    }, null, {
        sort: {
            timeStamp: 1
        }
    }, (err, result) => {
        if (err) {
            growthRateData = undefined;
            console.log('[LoadGrowthRateCSV] getGrowthRateData (err): ' + err);
        } else if (!result) {
            growthRateData = undefined;
            console.log('[LoadGrowthRateCSV] getGrowthRateData (!result):' + result);
        }else{
            growthRateData = result;
        }
    })

}