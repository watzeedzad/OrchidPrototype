const mongoose = require('mongoose');
const greenHouse = mongoose.model('greenHouse');
const fs = require("fs");

let configFile;

export default class DeleteGreenHouse {

    constructor(req, res) {
        this.operation(req, res);
    }

    async operation(req, res) {
        console.log("[DeleteGreenHouse] session id: " + req.session.id);
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

        let greenHouseIdIndex;

        await findAndDeleteGreenHouse(id, function (deleteGreenHouseResult, doc) {
            if (doc.picturePath != null) {
                deletePicture("../OrchidPrototype-Client/public/assets/images/greenhouse", doc.picturePath, function (result) {
                    if (deleteGreenHouseResult && result) {
                        greenHouseIdIndex = seekGreenHouseIdIndex(configFile.temperatureConfigs, doc.greenHouseId);
                        configFile.temperatureConfigs.splice(greenHouseIdIndex, 1);
                        greenHouseIdIndex = seekGreenHouseIdIndex(configFile.humidityConfigs, doc.greenHouseId);
                        configFile.humidityConfigs.splice(greenHouseIdIndex, 1);
                        greenHouseIdIndex = seekGreenHouseIdIndex(configFile.soilMoistureConfigs, doc.greenHouseId);
                        configFile.soilMoistureConfigs.splice(greenHouseIdIndex, 1);
                        greenHouseIdIndex = seekGreenHouseIdIndex(configFile.lightIntensityConfigs, doc.greenHouseId);
                        configFile.lightIntensityConfigs.splice(greenHouseIdIndex, 1);
                        greenHouseIdIndex = seekGreenHouseIdIndex(configFile.lightVolumeConfigs, doc.greenHouseId);
                        configFile.lightVolumeConfigs.splice(greenHouseIdIndex, 1);
                        greenHouseIdIndex = seekGreenHouseIdIndex(configFile.watering, doc.greenHouseId);
                        configFile.watering.splice(greenHouseIdIndex, 1);
                        deleteGreenHouseConfig(configFile, req.session.configFilePath, function (deleteGreenHouseConfigStatus) {
                            if (deleteGreenHouseConfigStatus) {
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
                if (deleteGreenHouseResult) {
                    greenHouseIdIndex = seekGreenHouseIdIndex(configFile.temperatureConfigs, doc.greenHouseId);
                    configFile.temperatureConfigs.splice(greenHouseIdIndex, 1);
                    greenHouseIdIndex = seekGreenHouseIdIndex(configFile.humidityConfigs, doc.greenHouseId);
                    configFile.humidityConfigs.splice(greenHouseIdIndex, 1);
                    greenHouseIdIndex = seekGreenHouseIdIndex(configFile.soilMoistureConfigs, doc.greenHouseId);
                    configFile.soilMoistureConfigs.splice(greenHouseIdIndex, 1);
                    greenHouseIdIndex = seekGreenHouseIdIndex(configFile.lightIntensityConfigs, doc.greenHouseId);
                    configFile.lightIntensityConfigs.splice(greenHouseIdIndex, 1);
                    greenHouseIdIndex = seekGreenHouseIdIndex(configFile.lightVolumeConfigs, doc.greenHouseId);
                    configFile.lightVolumeConfigs.splice(greenHouseIdIndex, 1);
                    greenHouseIdIndex = seekGreenHouseIdIndex(configFile.watering, doc.greenHouseId);
                    configFile.watering.splice(greenHouseIdIndex, 1);
                    deleteGreenHouseConfig(configFile, req.session.configFilePath, function (deleteGreenHouseConfigStatus) {
                        if (deleteGreenHouseConfigStatus) {
                            res.sendStatus(200);
                        } else {
                            res.sendStatus(500);
                        }
                    });
                }
            }
        });
    }
}

async function findAndDeleteGreenHouse(id, callback) {
    let deleteGreenHouseResult = null;

    let result = await greenHouse.findByIdAndRemove(id);

    await greenHouse.findByIdAndRemove(id, function (err) {
        if (err) {
            deleteGreenHouseResult = false;
            console.log('[DeleteGreenHouse] findAndDeleteGreenHouse(err): ' + err);
        } else {
            deleteGreenHouseResult = true;
        }
    });

    callback(deleteGreenHouseResult, result);
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
    });
}

function getConfigFile(req, callback) {
    // console.log("[DeleteGreenHouse] getConfigFilePath: " + req.session.configFilePath);
    let config = JSON.parse(
        require("fs").readFileSync(String(req.session.configFilePath), "utf8")
    );
    // configFile = config;
    callback(config);
}

async function deleteGreenHouseConfig(configFile, configFilePath, callback) {
    let deleteGreenHouseConfigStatus;
    let content = JSON.stringify(configFile);
    fs.writeFile(String(configFilePath), content, "utf8", function (err) {
        if (err) {
            console.log(err);
            deleteGreenHouseConfigStatus = false;
            return;
        }
    });
    deleteGreenHouseConfigStatus = true;
    console.log("[DeleteGreenHouse] write file with no error");
    callback(deleteGreenHouseConfigStatus);
}

function seekGreenHouseIdIndex(dataArray, greenHouseId) {
    let index = dataArray.findIndex(function (item, i) {
        return item.greenHouseId === greenHouseId;
    });
    return index;
}