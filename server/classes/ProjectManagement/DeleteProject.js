const mongoose = require('mongoose');
const fs = require("fs");
const project = mongoose.model('project')

let configFile;

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

        await getConfigFile(req, function (config) {
            configFile = config;
        });
        if (typeof configFile === "undefined") {
            res.sendStatus(500);
            return;
        }

        let projectIdIndex;

        await findAndDeleteProject(id, function (deleteProjectResult, doc) {
            if (doc.picturePath != null) {
                deletePicture("../OrchidPrototype-Client/public/assets/images/project", doc.picturePath, function (result) {
                    if (deleteProjectResult && result) {
                        projectIdIndex = seekProjectIdIndex(configFile.fertilityConfigs, doc.projectId);
                        configFile.fertilityConfigs.splice(projectIdIndex, 1);
                        projectIdIndex = seekProjectIdIndex(configFile.fertilizer, doc.projectId);
                        configFile.fertilizer.splice(projectIdIndex, 1);
                        deleteProjectConfig(configFile, req.session.configFilePath, function (deleteProjectResult) {
                            if (deleteProjectResult) {
                                res.sendStatus(200);
                            } else {
                                res.sendStatus(500);
                            }
                        });
                    } else {
                        res.sendStatus(500);
                    }
                });
            } else {
                if (deleteProjectResult) {
                    projectIdIndex = seekProjectIdIndex(configFile.fertilityConfigs, doc.projectId);
                    configFile.fertilityConfigs.splice(projectIdIndex, 1);
                    projectIdIndex = seekProjectIdIndex(configFile.fertilizer, doc.projectId);
                    configFile.fertilizer.splice(projectIdIndex, 1);
                    deleteProjectConfig(configFile, req.session.configFilePath, function (deleteProjectResult) {
                        if (deleteProjectResult) {
                            res.sendStatus(200);
                        } else {
                            res.sendStatus(500);
                        }
                    });
                } else {
                    res.sendStatus(500);
                }
            }
        });
    }

}

async function findAndDeleteProject(id, callback) {
    let deleteProjectResult = null;

    await project.findByIdAndRemove({
        _id: id
    }, function (err, doc) {
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

function getConfigFile(req, callback) {
    // console.log("[DeleteGreenHouse] getConfigFilePath: " + req.session.configFilePath);
    let config = JSON.parse(
        require("fs").readFileSync(String(req.session.configFilePath), "utf8")
    );
    // configFile = config;
    callback(config);
}

async function deleteProjectConfig(configFile, configFilePath, callback) {
    let deleteProjectConfigStatus;
    let content = JSON.stringify(configFile);
    fs.writeFile(String(configFilePath), content, "utf8", function (err) {
        if (err) {
            console.log(err);
            deleteProjectConfigStatus = false;
            return;
        }
    });
    deleteProjectConfigStatus = true;
    console.log("[DeleteGreenHouse] write file with no error");
    callback(deleteProjectConfigStatus);
}

function seekProjectIdIndex(dataArray, projectId) {
    let index = dataArray.findIndex(function (item, i) {
        return item.projectId === projectId;
    });
    return index;
}