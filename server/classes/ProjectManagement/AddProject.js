const mongoose = require('mongoose');
const project = mongoose.model('project')

export default class AddProject {

    constructor(req, res) {
        this.operation(req, res)
    }

    async operation(req, res) {
        console.log("[FertilizerConfig] session id: " + req.session.id);
        if (typeof req.session.farmData === "undefined" || typeof req.session.configFilePath === "undefined") {
            res.sendStatus(401);
            return;
        }

        let farmId = req.session.farmId;
        let greenHouseId = req.headers.greenhouseid;
        let name = req.headers.name;
        let tribeName = req.headers.tribename;
        let picturePath = req.file.filename;
        let currentRatio = req.headers.currentratio;
        
        await addProject(farmId, greenHouseId, name, tribeName, picturePath, currentRatio, function (addProjectResult) {
            if (addProjectResult) {
                res.sendStatus(200);
            } else {
                res.sendStatus(500);
            }
        });
    }

}


async function addProject(farmId, greenHouseId, name, tribeName, picturePath, currentRatio, callback) {
    let addProjectResult = null;

    let projectData = new project({
        farmId: farmId,
        greenHouseId: greenHouseId,
        name: name,
        tribeName: tribeName,
        picturePath: picturePath,
        isAutoFertilizering: false,
        currentRatio: currentRatio
    });

    await projectData.save(function (err, doc) {
        if (err) {
            addProjectResult = false;
            console.log('[AddProject] addProject(err):  ' + err);
        } else if (!doc) {
            addProjectResult = false;
            console.log('[AddProject] addProject(!doc): ' + doc);
        } else {
            addProjectResult = true;
        }
        callback(addProjectResult);
    })
}