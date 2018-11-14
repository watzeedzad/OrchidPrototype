const mongoose = require('mongoose');
const fs = require("fs");
const project = mongoose.model('project')

let configFile;
let defaultConfigFile;

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
        let picturePath;
        let currentRatio = req.headers.currentratio;

        if (typeof req.file === "undefined") {
            picturePath = null;
        } else {
            picturePath = req.file.filename;
        }

        await getConfigFile(req, function (config) {
            configFile = config;
        });
        await getDefaultConfigFile("./conf/default.json", function (defaultConfig) {
            defaultConfigFile = defaultConfig;
        });
        if (typeof configFile === "undefined" || typeof defaultConfigFile === "undefined") {
            res.sendStatus(500);
            return;
        }

        await addProject(farmId, greenHouseId, name, tribeName, picturePath, currentRatio, function (addProjectResult, doc) {
            if (addProjectResult) {
                configFile.fertilityConfigs.push({
                    projectId: doc.projectId,
                    minFertility: defaultConfigFile.defaultMinFertility,
                    maxFertility: defaultConfigFile.defaultMaxFertility
                });
                configFile.fertilizer.push({
                    projectId: doc.projectId,
                    timeRanges: defaultConfigFile.defaultFertilizeringTimeRanges
                });
                writeConfigFile(configFile, req.session.configFilePath, function(writeConfigFileStatus) {
                    if (writeConfigFileStatus) {
                        res.sendStatus(200);
                    } else {
                        res.sendStatus(500);
                    }
                });
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
        callback(addProjectResult, doc);
    })
}

function getConfigFile(req, callback) {
    // console.log("[AddGreenHouse] getConfigFilePath: " + req.session.configFilePath);
    let config = JSON.parse(
        require("fs").readFileSync(String(req.session.configFilePath), "utf8")
    );
    // configFile = config;
    callback(config);
}

function getDefaultConfigFile(path, callback) {
    let config = JSON.parse(
        fs.readFileSync(String(path)), "utf8"
    );
    callback(config);
}

async function writeConfigFile(configFile, configFilePath, callback) {
    let writeConfigFileStatus;
    let content = JSON.stringify(configFile);
    fs.writeFile(String(configFilePath), content, "utf8", function (err) {
        if (err) {
            console.log(err);
            writeConfigFileStatus = false;
            return;
        }
    });
    writeConfigFileStatus = true;
    console.log("[AddProject] write file with no error");
    callback(writeConfigFileStatus);
}