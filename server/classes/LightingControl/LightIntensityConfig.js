const fs = require("fs");

let configFile;

export default class LightIntensityConfig {
    constructor(req, res) {
        this.operation(req, res);
    }

    async operation(req, res) {
        if (typeof req.session.farmData === "undefined" || typeof req.session.configFilePath === "undefined") {
            res.sendStatus(500);
            return;
        }
        console.log("[LightIntensityConfig] session id: " + req.session.id);
        req.session.reload(function (err) {
            console.log("[LightIntensityConfig] " + err);
        });
        await getConfigFile(req);
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
        let greenHouseIndex = await seekGreenHouseIdIndex(configFile, greenHouseId);
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
          await writeConfigFile(configFile, res);
    }
}

function getConfigFile(req) {
    console.log("[LightIntensityConfig] getConfigFilePath: " + req.session.configFilePath);
    let config = JSON.parse(
        require("fs").readFileSync(String(req.session.configFilePath), "utf8")
    );
    configFile = config;
}

function writeConfigFile(configFile, res) {
    let writeFileResult;
    let content = JSON.stringify(configFile);
    fs.writeFile(String(pathGlobal), content, "utf8", function (err) {
        if (err) {
            console.log(err);
            writeFileResult = false;
        }
        writeFileResult = true;
        console.log("[LightIntensityConfig] write file with no error");
        if (writeFileResult) {
            res.sendStatus(200);
        } else {
            res.json({
                status: 500,
                errorMessage: "เกิดข้อผิดพลาดไม่สามารถเขียนไฟล์การตั้งค่าได้"
            });
        }
    });
}

function seekGreenHouseIdIndex(dataArray, greenHouseId) {
    let index = dataArray.findIndex(function (item, i) {
        return item.greenHouseId === greenHouseId;
    });
    return index;
}