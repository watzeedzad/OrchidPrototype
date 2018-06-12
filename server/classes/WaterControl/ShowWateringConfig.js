const fs = require("fs");

let configFile;
let existGreenHouseIndex;

let newDate = new Date(1970, 0, 1, 10, 11);

export default class ShowWateringConfig {
    constructor(req, res) {
        this.process(req, res);
    }

    async process(req, res) {
        let greenHouseId = req.body.greenHouseId;
        if (typeof greenHouseId === "undefined") {
            res.json({
                status: 500,
                message: "เกิดข้อผิดพลาดในการแสดงการตั้งค่าการให้น้ำ"
            });
        } else {
            getConfigFile();
            let wateringConfig = configFile.watering;
            if (Object.keys(wateringConfig).length == 0) {
                res.json({
                    status: 200,
                    message: "ไม่มีข้อมูลการตั้งค่าการให้น้ำในโรงเรือนใด ๆ",
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
                    status: 200,
                    message: "ไม่มีข้อมูลการตั้งค่าการให้น้ำในโรงเรือนที่ระบุ",
                    status: false
                });
            } else {
                res.json(configFile.watering[existGreenHouseIndex]);
            }
        }
    }
}

async function getConfigFile() {
    console.log("[ShowWateringConfig] getConfigFilePath, " + pathGlobal);
    let config = JSON.parse(
        require("fs").readFileSync(String(pathGlobal), "utf8")
    );
    configFile = config;
}