const fs = require("fs");

let configFile;

export default class LightVolumeConfig {
    constructor(req, res) {
        this.operation(req, res);
    }

    async operation(req, res) {
        if (typeof req.session.farmData === "undefined" || typeof req.session.configFilePath === "undefined") {
            res.sendStatus(500);
            return;
        }
        console.log("[LightVolumeConfig] session id: " + req.session.id);
        // req.session.reload(function (err) {
        //     console.log("[LightVolumeConfig] " + err);
        // });
        // await getConfigFile(req);
        configFile = req.session.configFile;
        if (typeof configFile === "undefined") {
            res.json({
                status: 500,
                errorMessage: "เกิดข้อผิดพลาดไม่สามารถอ่านไฟล์การตั้งค่าได้"
            });
            return;
        }
        if (typeof req.body.minLightVolume === "undefined" || req.body.maxLightVolume === "undefined" || req.body.greenHouseid === "undefined") {
            res.json({
                status: 500,
                errorMessage: "เกิดข้อผิดพลาดในการตั้งค่าปริมาณแสง"
            });
        }
        let minLightVolume = req.body.minLightVolume;
        let maxLightVolume = req.body.maxLightVolume;
        let greenHouseId = req.body.greenHouseId;
        console.log("[LightVolumeConfig] minLightVolume: " + minLightVolume);
        console.log("[LightVolumeConfig] maxLightVolume: " + maxLightVolume);
        console.log("[LightVolumeConfig] greenHouseId: " + greenHouseId);
        let greenHouseIndex = seekGreenHouseIdIndex(configFile, greenHouseId);
        if (greenHouseIdIndex == -1) {
            res.json({
              status: 500,
              errorMessage: "เกิดข้อผิดพลาดในการตั้งค่าปริมาณแสง"
            });
            return;
          }
          if (minLightVolume > maxLightVolume) {
            res.json({
              status: 500,
              errorMessage: "เกิดข้อผิดพลาดในการตั้งค่าปริมาณแสง"
            });
            return;
          }
          let updateData = {
            greenHouseId: greenHouseId,
            minLightVolume: minLightVolume,
            maxLightVolume: maxLightVolume
          }
          configFile.lightVolumeConfigs[greenHouseIdIndex] = updateData;
          await writeConfigFile(configFile, res);
    }
}

// function getConfigFile(req) {
//     console.log("[LightVolumeConfig] getConfigFilePath: " + req.session.configFilePath);
//     let config = JSON.parse(
//         require("fs").readFileSync(String(req.session.configFilePath), "utf8")
//     );
//     configFile = config;
// }

function writeConfigFile(configFile, res) {
    let writeFileResult;
    let content = JSON.stringify(configFile);
    fs.writeFile(String(pathGlobal), content, "utf8", function (err) {
        if (err) {
            console.log(err);
            writeFileResult = false;
        }
        writeFileResult = true;
        console.log("[LightVolumeConfig] write file with no error");
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