let configFile;
let existProjectIndex;

export default class ShowFertilizerConfig {
    constructor(req, res) {
        this.process(req, res);
    }

    async process(req, res) {
        console.log("[ShowFertilizerConfig] session id: " + req.session.id);
        if (typeof req.session.farmData === "undefined" || typeof req.session.configFilePath === "undefined") {
            res.sendStatus(401);
            return;
        }
        await getConfigFile(req, function (config) {
            configFile = config;
        });
        let projectId = req.body.projectId;
        if (typeof projectId === "undefined") {
            res.json({
                status: 500,
                errorMessage: "เกิดข้อผิดพลาดในการแสดงการตั้งค่าการให้ปุ๋ย"
            });
            return;
        }
        if (typeof configFile === "undefined") {
            res.json({
                status: 500,
                errorMessage: "เกิดข้อผิดพลาดในการแสดงการตั้งค่าการให้ปุ๋ย"
            });
            return;
        }
        let fertilizerConfig = configFile.fertilizer;
        // if (Object.keys(fertilizerConfig).length == 0) {
        //     res.json({
        //         status: 500,
        //         errorMessage: "ไม่มีข้อมูลการตั้งค่าการให้น้ำในโปรเจคใดๆ",
        //         result: false
        //     });
        // } else {
        //     for (let index = 0; index < Object.keys(fertilizerConfig).length; index++) {
        //         let temp = fertilizerConfig[index];
        //         if (temp.projectId == projectId) {
        //             existProjectIndex = index;
        //         }
        //     }
        // }
        existProjectIndex = await seekProjectIdIndex(fertilizerConfig, projectId);
        if (existProjectIndex == -1) {
            res.json({
                status: 500,
                errorMessage: "ไม่มีข้อมูลการตั้งค่าการให้น้ำในโปรเจคที่ระบุ",
                result: false
            });
        }
        res.json(configFile.fertilizer[existProjectIndex]);
    }
}

function getConfigFile(req, callback) {
    // console.log("[ShowFertilizerConfig] getConfigFilePath, " + req.session.configFilePath);
    let config = JSON.parse(
        require("fs").readFileSync(String(req.session.configFilePath), "utf8")
    );
    // configFile = config;
    callback(config);
}

function seekProjectIdIndex(dataArray, projectId) {
    let index = dataArray.findIndex(function (item, i) {
        return item.projectId === projectId;
    });
    return index;
}