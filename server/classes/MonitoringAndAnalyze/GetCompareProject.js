const mongoose = require('mongoose');
const project = mongoose.model('project');


let compareProjectData = undefined;


export default class GetCompareProject {

    constructor(req, res) {

        operation(req, res);

    }
}
async function operation(req, res) {
    console.log("[GetCompareProject] session id: " + req.session.id);
    if (typeof req.session.farmData === "undefined" || typeof req.session.configFilePath === "undefined") {
        console.log(req.session.farmData + " / " + req.session.configFilePath)
        res.sendStatus(401);
        return;
    }

    let projectId = req.body.projectId
    let greenHouseId = req.body.greenHouseId
    console.log(projectId,greenHouseId)
    if (typeof greenHouseId === 'undefined') {
        res.json({
            status: 500,
            errorMessage: "เกิดข้อผิดพลาดในการเเสดงข้อมูล Project ทั้งหมด"
        });
        return;
    }

    compareProjectData = await getProjectData(projectId,greenHouseId);

    if (compareProjectData == null) {
        res.json({
            status: 500,
            errorMessage: 'เกิดข้อผิดพลาดในการเเสดงข้อมูล Project ทั้งหมด'
        });
        return;
    }
    res.json(compareProjectData);
}


async function getProjectData(projectId,greenHouseId) {
    let result = await project.find({
        greenHouseId: greenHouseId,
        projectId: {
            $ne: projectId
        }
    }, null, {
        sort: {
            projectId: 1
        }
    }, (err, result) => {
        if (err) {
            compareProjectData = null;
            console.log('[GetCompareProject] getProjectData(err): ' + err);
        } else if (!result) {
            compareProjectData = null;
            console.log('[GetCompareProject] getProjectData(doc): ' + doc);
        }
    });
    return result;
}