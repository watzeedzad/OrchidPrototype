const mongoose = require('mongoose');
const fs = require("fs");
const greenHouse = mongoose.model('greenHouse');

let configFile;
let defaultConfigFile;

export default class AddGreenHouse {

    constructor(req, res) {
        this.operation(req, res);
    }

    async operation(req, res) {
        console.log("[AddGreenHouse] session id: " + req.session.id);
        if (typeof req.session.farmData === "undefined" || typeof req.session.configFilePath === "undefined") {
            res.sendStatus(401);
            return;
        }

        let farmId = req.session.farmId;
        let name = req.body.greenHouseName;
        let desc = req.body.greenHouseDesc;
        let picturePath;

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

        await addGreenHouse(farmId, name, desc, picturePath, function (addGreenHouseResult, doc) {
            if (addGreenHouseResult) {
                configFile.temperatureConfigs.push({
                    greenHouseId: doc.greenHouseId,
                    minTemperature: defaultConfigFile.defaultMinTemperature,
                    maxTemperature: defaultConfigFile.defaultMaxTemperature
                });
                configFile.humidityConfigs.push({
                    greenHouseId: doc.greenHouseId,
                    minHumidity: defaultConfigFile.defaultMinHumidity,
                    maxHumidity: defaultConfigFile.defaultMaxHumidity
                });
                configFile.soilMoistureConfigs.push({
                    greenHouseId: doc.greenHouseId,
                    minSoilMoisture: defaultConfigFile.defaultMinSoilMoisture,
                    maxSoilMoisture: defaultConfigFile.defaultMaxSoilMoisture
                });
                configFile.lightIntensityConfigs.push({
                    greenHouseId: doc.greenHouseId,
                    minLightIntensity: defaultConfigFile.defaultMinLightIntensity,
                    maxLightIntensity: defaultConfigFile.defaultMaxLightIntensity
                });
                configFile.lightVolumeConfigs.push({
                    greenHouseId: doc.greenHouseId,
                    maxLightVolume: defaultConfigFile.defaultMaxLightVolume
                });
                configFile.watering.push({
                    greenHouseId: doc.greenHouseId,
                    timeRanges: defaultConfigFile.defaultWateringTimeRanges
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

async function addGreenHouse(farmId, name, desc, picturePath, callback) {
    let addGreenHouseResult = null;

    let greenHouseData = new greenHouse({
        farmId: farmId,
        name: name,
        desc: desc,
        picturePath: picturePath,
    });

    await greenHouseData.save(function (err, doc) {
        if (err) {
            addGreenHouseResult = false;
            console.log('[AddGreenHouse] addGreenHouse(err):  ' + err);
        } else if (!doc) {
            addGreenHouseResult = false;
            console.log('[AddGreenHouse] addGreenHouse(!doc):  ' + dox);
        } else {
            addGreenHouseResult = true;
        }
        callback(addGreenHouseResult, doc);
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
    console.log("[AddGreenHouse] write file with no error");
    callback(writeConfigFileStatus);
}