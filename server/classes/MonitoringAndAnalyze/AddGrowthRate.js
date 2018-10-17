const mongoose = require('mongoose');
const growthRate = mongoose.model('growth_rate');

let addGrowRateResult;

export default class AddGrowthRate {

    constructor(req, res) {
        this.operation(req, res);
    }

    async operation(req, res) {
        console.log("[AddGrowthRate] session id: " + req.session.id);
        if (typeof req.session.farmData === "undefined" || typeof req.session.configFilePath === "undefined") {
            res.sendStatus(401);
            return;
        }

        let farmId = req.session.farmId;
        let greenHouseId = req.body.greenHouseId;
        let projectId = req.body.projectId;
        let trunkDiameter = req.body.trunkDiameter;
        let leafWidth = req.body.leafWidth;
        let totalLeaf = req.body.totalLeaf;
        let height = req.body.height;
        let timeStamp = req.body.timeStamp;

        await addUser(farmId, greenHouseId, projectId, trunkDiameter, leafWidth, totalLeaf,height,timeStamp);
        console.logfarmId, greenHouseId, projectId, trunkDiameter, leafWidth, totalLeaf,height,timeStamp
        if (addGrowRateResult) {
            res.sendStatus(200);
        } else {
            res.sendStatus(500);
        }
    }
}

async function addUser(farmId, greenHouseId, projectId, trunkDiameter, leafWidth, totalLeaf,height,timeStamp) {

    let growthRateData = new growthRate({
        farmId:farmId,
        greenHouseId: greenHouseId,
        projectId: projectId,
        trunkDiameter: trunkDiameter,
        leafWidth: leafWidth,
        totalLeaf: totalLeaf,
        height: height,
        timeStamp: timeStamp,

    });

    console.log(growthRateData);

    growthRateData.save(function (err, doc) {
        if (err) {
            addGrowRateResult = false;
            console.log('[AddGrowthRate] addGrowthRate (err):  ' + err);
        } else if (!doc) {
            addGrowRateResult = false;
            console.log('[AddGrowthRate] addGrowthRate (!doc):  ' + doc);
        } else {
            addGrowRateResult = true;
        }
    })





}