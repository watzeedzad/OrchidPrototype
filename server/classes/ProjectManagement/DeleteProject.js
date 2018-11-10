const mongoose = require('mongoose');
const project = mongoose.model('project')

export default class DeleteProject {

    constructor(req, res) {
        this.operation(req, res);
    }

    async operation(req, res) {
        console.log('[FertilizerConfig] session id: ' + req.session.id)
        if (typeof req.session.farmData === "undefined" || typeof req.session.configFilePath === "undefined") {
            res.sendStatus(401);
            return;
        }

        let id = req.body.id;

        await findAndDeleteProject(id, function (deleteProjectResult, doc) {
            deletePicture("../OrchidPrototype-Client/public/assets/images/project", doc.picturePath, function (result) {
                if (deleteProjectResult && result) {
                    res.sendStatus(200);
                } else {
                    res.sendStatus(500);
                }
            });
        });
    }

}

async function findAndDeleteProject(id, callback) {
    let deleteProjectResult = null;

    await project.findOneAndRemove({
        _id: id
    }, (err, doc) => {
        if (err) {
            deleteProjectResult = false
            console.log('[DeleteProject] findAndDeleteProject(err): ' + err);
        } else if (!doc) {
            deleteProjectResult = false
            console.log('[DeleteProject] findAndDeleteProject(err): ' + doc);
        } else {
            deleteProjectResult = true;
        }
        callback(deleteProjectResult, doc)
    });
}

async function deletePicture(path, fileName, callback) {
    let removeFile = path + "/" + fileName;
    let result = null;
    fs.unlink(removeFile, function (err) {
        if (err) {
            result = false;
        } else {
            result = true;
        }
        callback(result);
    })
}