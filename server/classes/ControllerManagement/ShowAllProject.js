const mongoose = require('mongoose');
const project = mongoose.model('project');

let showProjectData;

export default class ShowAllGreenHouseController {

    constructor(req, res) {
        this.process(req, res);
    }

    async process(req, res) {
        console.log("[showGreenHouse] session id: " + req.session.id);
        if (typeof req.session.farmData === "undefined" || typeof req.session.configFilePath === "undefined") {
            console.log(req.session.farmData+" / "+req.session.configFilePath)
            res.sendStatus(500);
            return;
        }
        let farmId = req.session.farmId;
        let greenHouseId = req.body.greenHouseId;

        if (typeof farmId === "undefined") {
            res.json({
                status: 500,
                errorMessage: "เกิดข้อผิดพลาดในการเเสดงข้อมูล Project ทั้งหมด"
            });
            return;
        }
        await getProjectData(farmId,greenHouseId);

        if (typeof showProjectData ===  "undefined") {
            res.json({
                status: 500,
                errorMessage: "เกิดข้อผิดพลาดในการเเสดงข้อมูล Project ทั้งหมด"
            });
            return;
        }else if (showProjectData.length == 0) {
            res.json({
                status: 500,
                errorMessage: "เกิดข้อผิดพลาดไม่มีข้อมูล Project"
            });
            return;
        }
       
        showProjectData.sort(function(a, b){return a.greenHouseId - b.greenHouseId});
        
        res.json(showProjectData);
    }

}



async function getProjectData(farmId,greenHouseId) {
    await project.find({
        farmId: farmId,
        greenHouseId: greenHouseId
    }, (err, result) => {
        if (err) {
            showProjectData = undefined;
            console.log("[showGreenHouseControllerData] getControllerData (err):  " + err);
        } else if (!result) {
            showProjectData = undefined;
            console.log("[showGreenHouseControllerData getControllerData(!result): " + result);
        } else {
            showProjectData = result;
        }
    });
}