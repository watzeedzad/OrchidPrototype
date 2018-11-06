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
        let name = req.body.name
        let tribeName = req.body.tribeName
        let picturePath = req.body.picturePath
        let currentRatio = req.body.currentRatio

        await editProjectData(id, name, tribeName, picturePath, currentRatio, function (editProjectResult) {
            if (editProjectResult) {
                res.sendStatus(200);
            } else {
                res.sendStatus(500);
            }
        });
    }

}

async function editProjectData(id, name, tribeName, picturePath, currentRatio, callback) {
    let editProjectResult = null;

    await project.findOneAndUpdate({
        _id: id
    }, {
        $set: {
            tribeName: tribeName,
            name: name,
            picturePath: picturePath,
            isAutoFertilizering: false,
            currentRatio: currentRatio
        }
    }, (err, doc) => {
        if (err) {
            editProjectResult = false;
            console.log('[EditProject] editProjectData(err) : ' + err);
        } else if (!doc) {
            editProjectResult = false;
            console.log('[EditProject] editProjectData(!doc) : ' + doc)
        } else {
            editProjectResult = true;
        }
        callback(editProjectResult);
    })
}