const mongoose = require('mongoose');
const project = mongoose.model('project');

let showProjectData = undefined;

export default class ShowAllGreenHouseController {

    constructor(req, res) {
        process(req, res);
    }
}

async function process(req, res) {
    console.log("[ShowAllProject] session id: " + req.session.id);
    if (typeof req.session.farmData === "undefined" || typeof req.session.configFilePath === "undefined") {
        console.log(req.session.farmData + " / " + req.session.configFilePath)
        res.sendStatus(401);
        return;
    }
    let greenHouseId = req.body.greenHouseId;

    showProjectData = await getProjectData(greenHouseId);
    if (showProjectData == null) {
        res.json({
            status: 500,
            errorMessage: "เกิดข้อผิดพลาดในการเเสดงข้อมูล Project ทั้งหมด"
        });
        return;
    } else if (showProjectData.length == 0) {
        res.json({
            status: 500,
            errorMessage: "เกิดข้อผิดพลาดไม่มีข้อมูล Project"
        });
        return;
    }

    // showProjectData.sort(function (a, b) {
    //     return a.projectId - b.projectId
    // });

    res.json(showProjectData);
}



async function getProjectData(greenHouseId) {
    let result = await project.find({
        greenHouseId: greenHouseId
    }, null, {
        sort: {
            projectId: 1
        }
    }, (err, result) => {
        if (err) {
            showProjectData = null;
            console.log("[ShowAllProject] getProjectData (err):  " + err);
        } else if (!result) {
            showProjectData = null;
            console.log("[ShowAllProject] getProjectData (!result): " + result);
        } else {
            showProjectData = result;
        }
    });
    return result;
}