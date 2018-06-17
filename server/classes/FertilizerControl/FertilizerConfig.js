const fs = require("fs");

let configFile;
let existProjectIndex;

export default class FertilizerConfig {
    constructor(req, res) {
        this.process(req, res);
    }

    async process(req, res) {
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
            getConfigFile();
            let tempJson = {
                projectId: projectId,
                timeRanges: []
            };
            let fertilizerConfig = configFile.fertilizer;
            let tempArray = [];
            if (!Object.keys(fertilizerConfig).length == 0) {
                for (let index = 0; index < Object.keys(fertilizerConfig).length; index++) {
                    let temp = fertilizerConfig[index];
                    if (temp.projectId == projectId) {
                        existProjectIndex = index;
                    }
                }
            }
            for (let index = 0; index < configTimeRanges.length; index++) {
                let tempDate = configTimeRanges[index];
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
            writeConfigFile(configFile, res);
        }
    }
}

async function getConfigFile() {
    console.log("[FertilizerConfig] getConfigFilePath, " + pathGlobal);
    let config = JSON.parse(
        require("fs").readFileSync(String(pathGlobal), "utf8")
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
        console.log("[FertilizerConfig] write file with no error");
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