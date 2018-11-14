const fs = require("fs");

let configFile;
let existProjectIndex;
let writeFileStatus;

export default class FertilizerConfig {
    constructor(req, res) {
        this.process(req, res);
    }

    async process(req, res) {
        console.log("[FertilizerConfig] session id: " + req.session.id);
        if (typeof req.session.farmData === "undefined" || typeof req.session.configFilePath === "undefined") {
            res.sendStatus(401);
            return;
        }
        configFile = req.session.configFile;
        let projectId = req.body.projectId;
        let configTimeRanges = req.body.timeRanges;
        if (
            typeof projectId === "undefined" ||
            typeof configTimeRanges === "undefined"
        ) {
            res.json({
                status: 500,
                errorMessage: "เกิดข้อผิดพลาดในการตั้งค่าการให้ปุ๋ยอัตโนมัติ"
            });
        } else {
            let tempJson = {
                projectId: projectId,
                timeRanges: []
            };
            let fertilizerConfig = configFile.fertilizer;
            // let tempArray = [];
            // if (!Object.keys(fertilizerConfig).length == 0) {
            //     for (let index = 0; index < Object.keys(fertilizerConfig).length; index++) {
            //         let temp = fertilizerConfig[index];
            //         if (temp.projectId == projectId) {
            //             existProjectIndex = index;
            //         }
            //     }
            // }
            existProjectIndex = await seekProjectIdIndex(fertilizerConfig, projectId);
            for (let index = 0; index < configTimeRanges.length; index++) {
                let tempDate = new Date(configTimeRanges[index]);
                let tempTimeMills = tempDate.getTime();
                tempJson.timeRanges.push(tempTimeMills);
            }
            if (typeof existProjectIndex === "undefined") {
                res.json({
                    status: 500,
                    errorMessage: "ไม่สามารถตั้งค่าการให้ปุ๋ยของโปรเจคที่ระบุได้",
                });
                return;
            }
            configFile.fertilizer[existProjectIndex] = tempJson;
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
}

// async function getConfigFile(req) {
//     console.log("[FertilizerConfig] getConfigFilePath, " + req.session.configFilePath);
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
    console.log("[FertilizerConfig] write file with no error");
}

function seekProjectIdIndex(dataArray, projectId) {
    let index = dataArray.findIndex(function (item, i) {
        return item.projectId === projectId;
    });
    return index;
}