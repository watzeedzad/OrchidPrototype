const fs = require("fs");

let configFile;
let existProjectIndex;

export default class ShowFertilizerConfig {
    constructor(req, res) {
        this.process(req, res);
    }

    async process(req, res) {
        let projectId = req.body.projectId;
        if (typeof projectId === "undefined") {
            res.json({
                status: 500,
                errorMessage: "เกิดข้อผิดพลาดในการแสดงการตั้งค่าการให้ปุ๋ย"
            });
            return;
        }
        getConfigFile();
        if (typeof configFile === "undefined") {
            res.json({
                status: 500,
                errorMessage: "เกิดข้อผิดพลาดในการแสดงการตั้งค่าการให้ปุ๋ย"
            });
            return;
        }
        let fertilizerConfig = configFile.fertilizer;
        if (Object.keys(fertilizerConfig).length == 0) {
            res.json({
                status: 500,
                errorMessage: "ไม่มีข้อมูลการตั้งค่าการให้น้ำในโปรเจคใดๆ",
                result: false
            });
        } else {
            for (let index = 0; index < Object.keys(fertilizerConfig).length; index++) {
                let temp = wateringConfig[index];
                if (temp.projectId == projectId) {
                    existProjectIndex = index;
                }
            }
        }
        if (typeof existProjectIndex === "undefined") {
            res.json({
                status: 500,
                errorMessage: "ไม่มีข้อมูลการตั้งค่าการให้น้ำในโปรเจคที่ระบุ",
                result: false
            });
        }
        res.json(configFile.fertilizer[existProjectIndex]);
    }
}

function getConfigFile() {
    console.log("[ShowFertilizerConfig] getConfigFilePath, " + pathGlobal);
    let config = JSON.parse(
        require("fs").readFileSync(String(pathGlobal), "utf8")
    );
    configFile = config;
}