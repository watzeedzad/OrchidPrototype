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
        let greenHouseId = req.body.greenHouseId;
        console.log(greenHouseId)
        await getProjectData(greenHouseId);
        console.log(showProjectData)
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
       
        showProjectData.sort(function(a, b){return a.projectId - b.projectId});
        
        res.json(showProjectData);
    }

}



async function getProjectData(greenHouseId) {
    await project.find({
        greenHouseId: greenHouseId
    }, (err, result) => {
        if (err) {
            showProjectData = undefined;
            console.log("[showProjectData] getProjectData (err):  " + err);
        } else if (!result) {
            showProjectData = undefined;
            console.log("[showProjectData getProjectData (!result): " + result);
        } else {
            showProjectData = result;
        }
    });
}