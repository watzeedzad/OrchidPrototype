const mongoose = require("mongoose");
const growthRate = mongoose.model("growth_rate");

let growthRateResult;

export default class ShowSpecificGrowthRateGraph {
    constructor(req, res) {
        this.operation(req, res);
    }

    async operation(req, res) {
        console.log("[ShowGrowthRateGraph] session id: " + req.session.id);
        if (typeof req.session.farmData === "undefined" || typeof req.session.configFilePath === "undefined") {
            res.sendStatus(401);
            return;
        }
        let projectId = req.body.projectId;
        if (typeof projectId === "undefined") {
            res.json({
                status: 500,
                errorMessage: "เกิดข้อผิดพลาดในการแสดงกราฟการเจริญเติบโต"
            });
            return;
        }
        growthRateResult = await getGrowthRateData(projectId, req.session.farmId);
        if (growthRateResult.length == 0) {
            res.json({
                status: 50,
                errorMessage: "เกิดข้อผิดพลาดไม่มีข้อมูลการเจริญเติบโต"
            });
            return;
        };
        let growthRateRaw = growthRateResult.actualRate;
        let growthRateArray = [];
        for (let index = 0; index < growthRateRaw.length; index++) {
            growthRateArray.push(growthRateRaw[index].height);
        }
        res.json({
            expectedRate: expectedGrowthRate,
            actualRate: growthRateArray
        });
    }
}

async function getGrowthRateData(projectId, farmId) {
    let result = await growthRate.find({
        projectId: projectId,
        farmId: farmId
    }, null, {
        sort: {
            "accualRate.count": 1
        }
    }, (err, result) => {
        if (err) {
            growthRateResult = null;
            console.log("[ShowGrowthRateGraph] getGrowthRateData (err): " + err);
        } else if (!result) {
            growthRateResult = null;
            console.log("[ShowGrowthRateGraph] getGrowthRateData (!result): " + result);
        } else {
            growthRateResult = result;
        }
    });
    return result;
}