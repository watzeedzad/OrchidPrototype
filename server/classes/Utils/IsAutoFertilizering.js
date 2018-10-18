const mongoose = require("mongoose");
const project = mongoose.model("project");

let projectDataResult;

export default class IsAutoFertilizering {
    constructor(req, res) {
        operation(req, res)
    }
}

async function operation(req, res) {
    console.log("[IsAutoFertilizering] session id: " + req.session.id);
        if (typeof req.session.farmData === "undefined" || typeof req.session.configFilePath === "undefined") {
            res.sendStatus(401);
            return;
        }

        let projectId = req.body.projectId;
        if (typeof projectId === "undefined") {
            res.sendStatus(500);
            return;
        }

        projectDataResult = await getProjectData(projectId);
        if (greenHouseDataResult == null) {
            req.sendStatus(500);
            return;
        }
        res.json({
            projectId: projectId,
            isAutoFertilizering: projectDataResult.isAutoFertilizering
        })
        
}

async function getProjectData(projectId) {
    let result = await project.findOne({
        projectId: projectId
    }, (err, result) => {
        if(err) {
            projectDataResult = null;
            console.log("[IsAutoFertilizering] getGreenHouseData (err): " + err);
        } else if (!result) {
            projectDataResult = null;
            console.log("[IsAutoFertilizering] getGreenHouseData (!result): " + result)
        } else {
            projectDataResult = result;
        }
    });
    return result;
}