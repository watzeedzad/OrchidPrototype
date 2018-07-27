const mongoose = require("mongoose");
const growthRate = mongoose.model("growth_rate");

let configFile;
let growthRateResult;

export default class ShowGrowthRateGraph {
    constructor(req, res) {
        this.operation(req, res);
    }

    async operation(req, res) {
        console.log("[ShowGrowthRateGraph] session id: " + req.session.id);
        if (typeof req.session.farmData === "undefined" || typeof req.session.configFilePath === "undefined") {
            res.sendStatus(500);
            return;
        }
        configFile = req.session.configFile;
        if (typeof configFile === "undefined") {
            res.json({
                status: 500,
                errorMessage: "เกิดข้อผิดพลาดไม่สามารถอ่านไฟล์การตั้งค่าได้"
            });
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
        await getGrowthRateData(projectId, req.session.farmId);
        if (typeof growthRateResult === "undefined") {
            res.json({
                status: 50,
                errorMessage: "เกิดข้อผิดพลาดไม่มีข้อมูลการเจริญเติบโต"
            });
            return;
        }
        let projectIdIndex = await seekProjectIdIndex(configFile.expectedGrowthRate, projectId);
        let expectedGrowthRate = configFile.expectedGrowthRate[projectIdIndex];
        let growthRateRaw = growthRateResult.accualRate;
        let growthRateArray = [];
        for (let index = 0; index < growthRateRaw.length; index++) {
            growthRateArray.push(growthRateRaw[index].height);
        }
        res.json({
            expectedRate: expectedGrowthRate,
            accualRate: growthRateArray
        });
    }
}

async function getGrowthRateData(projectId, farmId) {
    await growthRate.find({
        projectId: projectId,
        farmId: farmId
    }, null, {
        sort: {
            "accualRate.count": 1
        }
    }, (err, result) => {
        if (err) {
            growthRateResult = undefined;
            console.log("[ShowGrowthRateGraph] getGrowthRateData (err): " + err);
        } else if (!result) {
            growthRateResult = undefined;
            console.log("[ShowGrowthRateGraph] getGrowthRateData (!result): " + result);
        } else {
            growthRateResult = result;
        }
    });
}

function seekProjectIdIndex(dataArray, projectId) {
    let index = dataArray.findIndex(function (item) {
        return item.projectId === projectId;
    });
    return index;
}