const mongoose = require('mongoose');
const farm = mongoose.model('farm');
const fs = require("fs");
const crypto = require("crypto");

export default class AddFarm {

    constructor(req, res) {
        this.operation(req, res);
    }

    async operation(req, res) {

        let farmName = req.body.farmName;
        let ownerName = req.body.ownerName;
        let ownerSurname = req.body.ownerSurname;
        let ownerTel = req.body.ownerTel;
        let ownerAddress = req.body.ownerAddress;
        let configFilePath;
        let piMacAddress = req.body.piMacAddress;

        if (typeof ownerName === "undefined" || typeof ownerSurname === "undefined" || typeof ownerTel === "undefined" || typeof ownerAddress === "undefined" || typeof piMacAddress === "undefined" || typeof farmName === "undefined") {
            console.log("[AddFarm] one of require parameter is undefined: " + ownerName, ownerSurname, ownerTel, ownerAddress, piMacAddress);
            res.json({
                status: 500,
                errorMessage: "เกิดข้อผิดพลาดในการสร้างฟาร์มใหม่"
            });
            return;
        }

        let splitChar = piMacAddress[2];
        piMacAddress = (piMacAddress.split(splitChar)).toString();
        piMacAddress = piMacAddress.toLowerCase();

        let hash = crypto.createHash('sha256');
        hash.update(piMacAddress);
        hash.update(Date.now().toString());

        let filePath = "./conf/" + hash.digest("hex") + ".json";

        let emptyJson = {
            temperatureConfigs: [],
            humidityConfigs: [],
            soilMoistureConfigs: [],
            fertilityConfigs: [],
            lightIntensityConfigs: [],
            lightVolumeConfigs: [],
            watering: [],
            fertilizer: []
        };

        await writeNewConfigFile(filePath, emptyJson, function (writeFileStatus) {
            if (writeFileStatus) {
                configFilePath = filePath;
                addFarm(farmName, ownerName, ownerSurname, ownerTel, ownerAddress, configFilePath, piMacAddress, function (addFarmResult) {
                    if (addFarmResult) {
                        res.sendStatus(200);
                        return;
                    } else {
                        res.sendStatus(500)
                        return;
                    }
                });
            } else {
                res.json({
                    status: 500,
                    errorMessage: "เกิดข้อผิดพลาดในการสร้างฟาร์มใหม่"
                });
                return;
            }
        });
    }


}

async function addFarm(farmName, ownerName, ownerSurname, ownerTel, ownerAddress, configFilePath, piMacAddress, callback) {
    let addFarmResult = null;

    let farmData = new farm({
        farmName: farmName,
        ownerName: ownerName,
        ownerSurname: ownerSurname,
        ownerTel: ownerTel,
        ownerAddress: ownerAddress,
        configFilePath: configFilePath,
        piMacAddress: piMacAddress
    });

    await farmData.save(function (err) {
        if (err) {
            addFarmResult = false;
            console.log('[AddFarm] addFarm(err): ' + err);
        } else {
            addFarmResult = true;
        }
        callback(addFarmResult);
    })
}

async function writeNewConfigFile(path, rawContent, callback) {
    let content = JSON.stringify(rawContent);
    let writeFileStatus;
    fs.writeFileSync(String(path), content, "utf8", function (err) {
        if (err) {
            console.log(err);
            writeFileStatus = false;
        }
    });
    writeFileStatus = true;
    callback(writeFileStatus);
}