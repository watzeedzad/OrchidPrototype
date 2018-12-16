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

        // let projectId = req.body.projectId ? req.body.projectId : {
        //     $ne: null
        // };

        let projectId = req.body.projectId;

        if (typeof projectId === "undefined") {
            res.json({
                status: 500,
                errorMessage: "test"
            });
            return;
        }

        await getGrowthRateData(projectId, function(result) {
            if (result.length == 0) {
                console.log(result);
                res.json([]);
                return;
            } else {
                res.json(result);
            }
        });
    }
}


async function getGrowthRateData(projectId, callback) {
    await growth_rate.find({
        projectId: projectId
    }, null, {
        sort: {
            timeStamp: 1
        }
    }, (err, result) => {
        if (err) {
            console.log('[LoadCompareGrowthRate] getGrowthRateData (err): ' + err);
        } else if (!result) {
            console.log('[LoadCompareGrowthRate] getGrowthRateData (!result):' + result);
        }
        callback(result);
    });
}