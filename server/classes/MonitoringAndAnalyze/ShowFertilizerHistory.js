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
        let greenHouseId = req.body.greenHouseId;
        if (typeof greenHouseId === "undefined") {
            res.json({
                status: 500,
                errorMessage: "เกิดข้อผิดพลาดในการแสดงข้อมูลประวัติการให้น้ำ"
            });
            return;
        }
        fertilizerHistoryResultData = await getFertilizerHistoryData(req.session.farmId, greenHouseId);
        if (fertilizerHistoryResultData == null) {
            res.json({
                status: 500,
                errorMessage: "เกิดข้อผิดพลาดไม่มีข้อมูลประวัติการให้น้ำ"
            });
            return;
        }
        res.json(fertilizerHistoryResultData);
    }
}

async function getFertilizerHistoryData(farmId, greenHouseId) {
    let result = await fertilizerHistory.find({
        farmId: farmId,
        greenHouseId: greenHouseId
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