let configFile;
let existProjectIndex;

export default class ShowFertilizerConfig {
    constructor(req, res) {
        this.process(req, res);
    }

    async process(req, res) {
        if (typeof req.session.farmData === "undefined" || typeof req.session.configFilePath === "undefined") {
            res.sendStatus(500);
            return;
        }
        console.log("[ShowFertilizerConfig] session id: " + req.session.id);
        // req.session.reload(function (err) {
        //     console.log("[ShowFertilizerConfig] " + err);
        // });
        configFile = req.session.configFile;
        let projectId = req.body.projectId;
        if (typeof projectId === "undefined") {
            res.json({
                status: 500,
                errorMessage: "เกิดข้อผิดพลาดในการแสดงการตั้งค่าการให้ปุ๋ย"
            });
            return;
        }
        // getConfigFile(req);
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
                let temp = fertilizerConfig[index];
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

// function getConfigFile(req) {
//     console.log("[ShowFertilizerConfig] getConfigFilePath, " + req.session.configFilePath);
//     let config = JSON.parse(
//         require("fs").readFileSync(String(req.session.configFilePath), "utf8")
//     );
//     configFile = config;
// }