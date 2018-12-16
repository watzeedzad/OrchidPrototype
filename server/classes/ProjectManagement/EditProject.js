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

        let id = req.body.id;
        let name = req.body.name;
        let tribeName = req.body.tribeName;
        let picturePath;
        let currentRatio = req.body.currentRatio;

        if (typeof req.file === "undefined") {
            picturePath = null;
        } else {
            picturePath = req.file.filename;
        }

        await editProjectData(id, name, tribeName, picturePath, currentRatio, function (editProjectResult, doc) {
            if (typeof req.file === "undefined") {
                if (editProjectResult) {
                    res.sendStatus(200);
                    return;
                } else {
                    res.sendStatus(500);
                    return;
                }
            } else {
                deleteOldPicture(req.file.destination, doc.picturePath, function (result) {
                    if (editProjectResult && result) {
                        res.sendStatus(200);
                    } else {
                        res.sendStatus(500);
                    }
                });
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

async function deleteOldPicture(path, fileName, callback) {
    let removeFile = path + "/" + fileName;
    let result = null;
    fs.unlink(removeFile, function (err) {
        if (err) {
            result = false;
        } else {
            result = true;
        }
        callback(result);
    });
}