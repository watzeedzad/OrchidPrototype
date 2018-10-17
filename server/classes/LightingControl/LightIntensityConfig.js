const fs = require("fs");

let configFile;
let writeFileStatus;

export default class LightIntensityConfig {
    constructor(req, res) {
        this.operation(req, res);
    }

    async operation(req, res) {
        console.log("[LightIntensityConfig] session id: " + req.session.id);
        if (typeof req.session.farmData === "undefined" || typeof req.session.configFilePath === "undefined") {
            res.sendStatus(401);
            return;
        }
        configFile = req.session.configFile;
        if (typeof configFile === "undefined") {
            res.json({
                status: 500,
                errorMessage: "เกิดข้อผิดพลาดไม่สามารถอ่านไฟล์การตั้งค่าได้"
            });
            return;
        }
        if (typeof req.body.minLightIntensity === "undefined" || req.body.maxLightIntensity === "undefined" || req.body.greenHouseId === "undefined") {
            res.json({
                status: 500,
                errorMessage: "เกิดข้อผิดพลาดในการตั้งค่าความเข้มแสง"
            });
        }
        let minLightIntensity = req.body.minLightIntensity;
        let maxLightIntensity = req.body.maxLightIntensity;
        let greenHouseId = req.body.greenHouseId;
        console.log("[LightIntensityConfig] minLightIntensity: " + minLightIntensity);
        console.log("[LightIntensityConfig] maxLightIntensity: " + maxLightIntensity);
        console.log("[LightIntensityConfig] greenHouseId: " + greenHouseId);
        let greenHouseIdIndex = await seekGreenHouseIdIndex(configFile, greenHouseId);
        if (greenHouseIdIndex == -1) {
            res.json({
                status: 500,
                errorMessage: "เกิดข้อผิดพลาดในการตั้งค่าความเข้มแสง"
            });
            return;
        }
        if (minLightIntensity > maxLightIntensity) {
            res.json({
                status: 500,
                errorMessage: "เกิดข้อผิดพลาดในการตั้งค่าความเข้มแสง"
            });
            return;
        }
        let updateData = {
            greenHouseId: greenHouseId,
            minLightIntensity: minLightIntensity,
            maxLightIntensity: maxLightIntensity
        }
        configFile.lightIntensityConfigs[greenHouseIdIndex] = updateData;
        await writeConfigFile(configFile, req.session.configFilePath);
        if (writeFileStatus) {
            res.sendStatus(200);
        } else {
            res.json({
                status: 500,
                errorMessage: "เกิดข้อผิดพลาดไม่สามารถเขียนไฟล์การตั้งค่าได้"
            });
        }
    }
}

// function getConfigFile(req) {
//     console.log("[LightIntensityConfig] getConfigFilePath: " + req.session.configFilePath);
//     let config = JSON.parse(
//         require("fs").readFileSync(String(req.session.configFilePath), "utf8")
//     );
//     configFile = config;
// }

function writeConfigFile(configFile, configFilePath) {
    let content = JSON.stringify(configFile);
    fs.writeFile(String(configFilePath), content, "utf8", function (err) {
        if (err) {
            console.log(err);
            writeFileStatus = false;
            return;
        }
    });
    writeFileStatus = true;
    console.log("[LightIntensityConfig] write file with no error");
}

function seekGreenHouseIdIndex(dataArray, greenHouseId) {
    let index = dataArray.findIndex(function (item, i) {
        return item.greenHouseId === greenHouseId;
    });
    return index;
}