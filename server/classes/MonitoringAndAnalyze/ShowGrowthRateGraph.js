const mongoose = require("mongoose");
const growthRate = mongoose.model("growth_rate");

let configFile;
let growthRateResult;

export default class ShowGrowthRateGraph {
    constructor(req, res) {
        this.operation(req, res);
    }

    async operation(req, res) {
        if (typeof req.session.farmData === "undefined" || typeof req.session.configFilePath === "undefined") {
            res.sendStatus(500);
            return;
        }
        console.log("[ShowGrowthRateGraph] session id: " + req.session.id);
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
        
    }
}

async function getGrowthRateData(projectId, farmId) {
    await growthRate.find({
        projectId: projectId,
        farmId: farmId
    }, null, {
        sort: {
            _id: -1
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