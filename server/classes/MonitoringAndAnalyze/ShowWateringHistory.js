const mongoose = require("mongoose");
const waterHistory = mongoose.model("water_history");

let waterHistoryResultData;

export default class ShowWateringHistory {
    constructor(req, res) {
        this.operation(req, res);
    }

    async operation(req, res) {
        if (typeof req.session.farmData === "undefined" || typeof req.session.configFilePath === "undefined") {
            res.sendStatus(500);
            return;
        }
        console.log("[ShowWateringHistory] session id: " + req.session.id);
        let greenHouseId = req.body.greenHouseId;
        if (typeof greenHouseId === "undefined") {
            res.json({
                status: 500,
                errorMessage: "เกิดข้อผิดพลาดในการแสดงข้อมูลประวัติการให้น้ำ"
            });
            return;
        }
        await getWateringHistoryData(req.session.farmId, greenHouseId);
        if (typeof waterHistoryResultData === "undefined") {
            res.json({
                status: 500,
                errorMessage: "เกิดข้อผิดพลาดไม่มีข้อมูลประวัติการให้น้ำ"
            });
            return;
        }
        res.json(waterHistoryResultData);
    }
}

async function getWateringHistoryData(farmId, greenHouseId) {
    await waterHistory.find({
        farmId: farmId,
        greenHouseId: greenHouseId
    }, null, {
        sort: {
            _id: 1
        }
    }, (err, result) => {
        if (err) {
            waterHistoryResultData = undefined;
            console.log("[ShowWateringHistory] getWateringHistoryData (err): " + err);
        } else if (!result) {
            waterHistoryResultData = undefined;
            console.log("[ShowWateringHistory] getWAteringHistoryData (!result): " + result);
        } else {
            waterHistoryResultData = result;
        }
    });
}