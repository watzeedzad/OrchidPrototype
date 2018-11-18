const mongoose = require("mongoose");
const fertilizerHistory = mongoose.model("fertilizer_history");

let fertilizerHistoryResultData;

export default class ShowFertilizerHistory {
    constructor(req, res) {
        this.operation(req, res);
    }

    async operation(req, res) {
        console.log("[ShowFertilizerHistory] session id: " + req.session.id);
        if (typeof req.session.farmData === "undefined" || typeof req.session.configFilePath === "undefined") {
            res.sendStatus(401);
            return;
        }
        let projectId = req.body.projectId;
        if (typeof projectId === "undefined") {
            res.json({
                status: 500,
                errorMessage: "เกิดข้อผิดพลาดในการแสดงข้อมูลประวัติการให้น้ำ"
            });
            return;
        }
        fertilizerHistoryResultData = await getFertilizerHistoryData(req.session.farmId, projectId);
        if (fertilizerHistoryResultData === null) {
            fertilizerHistoryResultData = []
        }
        for (let index = 0; index < fertilizerHistoryResultData.history.length; index++) {
            let temp = fertilizerHistoryResultData.history[index].startTime;
            fertilizerHistoryResultData.history[index].startTime = temp.setTime(temp.getTime() + 25200000);
        }
        res.json(fertilizerHistoryResultData);
    }
}

async function getFertilizerHistoryData(farmId, projectId) {
    let result = await fertilizerHistory.findOne({
        farmId: farmId,
        projectId: projectId
    }, null, {
        sort: {
            _id: 1
        }
    }, (err, result) => {
        if (err) {
            fertilizerHistoryResultData = null;
            console.log("[ShowFertilizerHistory] getWateringHistoryData (err): " + err);
        } else if (!result) {
            fertilizerHistoryResultData = null;
            console.log("[ShowFertilizerHistory] getWAteringHistoryData (!result): " + result);
        } else {
            fertilizerHistoryResultData = result;
        }
    });
    return result;
}