const mongoose = require("mongoose");
const knowController = mongoose.model('know_controller');

let showProjectControllerData;

export default class showAllProjectController {

    constructor(req, res) {
        this.operation(req, res);
    }

    async operation(req, res) {
        console.log("[showGreenHouseControllerData] session id: " + req.session.id);
        if (typeof req.session.farmData === "undefined" || typeof req.session.configFilePath === "undefined") {
            res.sendStatus(500);
            return;
        }

        let farmId = req.session.farmId;
        let greenHouseId = req.body.greenHouseId;
        let projectId = req.body.projectId;

        if (typeof farmId === "undefined") {
            res.json({
                status: 500,
                errorMessage: "เกิดข้อผิดพลาดในการเเสดงข้อมูล Project Controller ทั้งหมด"
            });
            return;
        }

        await getProjectControllerData(farmId, greenHouseId, projectId);
        console.log("pj controller"+showProjectControllerData)
        if (typeof showProjectControllerData ===  "undefined") {
            res.json({
                status: 500,
                errorMessage: "เกิดข้อผิดพลาดในการเเสดงข้อมูล Project Controller ทั้งหมด"
            });
            return;
        }else if (showProjectControllerData.length == 0) {
            res.json({
                status: 500,
                errorMessage: "เกิดข้อผิดพลาดไม่มีข้อมูล Project Controller"
            });
            return;
        }

        showProjectControllerData.sort(function(a, b){return a.projectId - b.projectId});
        
        res.json(showProjectControllerData);
    }

}

async function getProjectControllerData(farmId, greenHouseId, projectId) {
    await knowController.find({
        farmId: farmId,
        greenHouseId: greenHouseId,
        projectId: projectId
    }, (err, result) => {
        if (err) {
            projectControllerData = undefined;
            console.log("[showProjectControllerData] getProjectControllerData(err): " + err);
        } else if (!result) {
            projectControllerData = undefined;
            console.log("[showProjectControllerData] getProjectControllerData(!result): " + result);
        } else {
            showProjectControllerData = result;
        }
    });
}