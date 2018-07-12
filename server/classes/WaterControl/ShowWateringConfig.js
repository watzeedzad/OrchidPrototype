const fs = require("fs");

let configFile;
let existGreenHouseIndex;

export default class ShowWateringConfig {
    constructor(req, res) {
        this.process(req, res);
    }

    async process(req, res) {
        if (typeof req.session.farmData === "undefined" || typeof req.session.configFilePath === "undefined") {
            res.sendStatus(500);
            return;
        }
        console.log("[ShowWateringConfig] session id: " + req.session.id);
        req.session.reload(function (err) {
            console.log("[ShowWateringConfig] " + err);
        });
        let greenHouseId = req.body.greenHouseId;
        if (typeof greenHouseId === "undefined") {
            res.json({
                status: 500,
                errorMessage: "เกิดข้อผิดพลาดในการแสดงการตั้งค่าการให้น้ำ"
            });
            return;
        }
        getConfigFile();
        if (typeof configFile === "undefined") {
            res.json({
                status: 500,
                errorMessage: "เกิดข้อผิดพลาดในการแสดงการตั้งค่าการให้น้ำ"
            });
            return;
        }
        let wateringConfig = configFile.watering;
        if (Object.keys(wateringConfig).length == 0) {
            res.json({
                status: 500,
                errorMessage: "ไม่มีข้อมูลการตั้งค่าการให้น้ำในโรงเรือนใดๆ",
                result: false
            });
        } else {
            for (let index = 0; index < Object.keys(wateringConfig).length; index++) {
                let temp = wateringConfig[index];
                if (temp.greenHouseId == greenHouseId) {
                    existGreenHouseIndex = index;
                }
            }
        }
        if (typeof existGreenHouseIndex === "undefined") {
            res.json({
                status: 500,
                errorMessage: "ไม่มีข้อมูลการตั้งค่าการให้น้ำในโรงเรือนที่ระบุ",
                status: false
            });
            return;
        }
        res.json(configFile.watering[existGreenHouseIndex]);
    }
}

function getConfigFile() {
    console.log("[ShowWateringConfig] getConfigFilePath, " + pathGlobal);
    let config = JSON.parse(
        require("fs").readFileSync(String(pathGlobal), "utf8")
    );
    configFile = config;
}