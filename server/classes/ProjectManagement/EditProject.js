const mongoose = require('mongoose');
const project = mongoose.model('project');

export default class EdirProject {

    constructor(req, res) {
        this.operation(req, res);
    }

    async operation(req, res) {
        console.log("[EditUser] session id: " + req.session.id);
        if (typeof req.session.farmData === "undefined" || typeof req.session.configFilePath === "undefined") {
            res.sendStatus(401);
            return;
        }

        let id = req.body.id
        let tribeName = req.body.tribeName
        let isAutoFertilizering = req.body.isAutoFertilizering
        let currentRatio = req.body.currentRatio

        await editProjectData(id, tribeName, isAutoFertilizering, currentRatio, function (editProjectResult) {
            if (editProjectResult) {
                res.sendStatus(200);
            } else {
                res.sendStatus(500)
            }
        });
    }

}

async function editProjectData(id, tribeName, picturePath, isAutoFertilizering, currentRatio, callback) {
    let editProjectResult;

    await project.findOne({
        _id: id
    }, {
        $set: {
            tribeName: tribeName,
            picturePath: picturePath,
            isAutoFertilizering: isAutoFertilizering,
            currentRatio: currentRatio
        }
    }, (err, doc) => {
        if (err) {
            editProjectResult = false;
            console.log('[EditProject] editProjectData(err) : ' + err);
        } else if (!doc) {
            editProjectData = false;
            console.log('[EditProject] editProjectData(!doc) : ' + doc)
        } else {
            editProjectResult = true;
        }
        callback(editProjectResult);
    })
}