let configFile;
let existGreenHouseIndex;

export default class ShowWateringConfig {
    constructor(req, res) {
        this.process(req, res);
    }

    async process(req, res) {
        console.log("[ShowWateringConfig] session id: " + req.session.id);
        if (typeof req.session.farmData === "undefined" || typeof req.session.configFilePath === "undefined") {
            res.sendStatus(401);
            return;
        }
        await getConfigFile(req, function (config) {
            configFile = config;
          });
        let greenHouseId = req.body.greenHouseId;
        if (typeof greenHouseId === "undefined") {
            res.json({
                status: 500,
                errorMessage: "เกิดข้อผิดพลาดในการแสดงการตั้งค่าการให้น้ำ"
            });
            return;
        }
        if (typeof configFile === "undefined") {
            res.json({
                status: 500,
                errorMessage: "เกิดข้อผิดพลาดในการแสดงการตั้งค่าการให้น้ำ"
            });
            return;
        }
        let wateringConfig = configFile.watering;
        // if (Object.keys(wateringConfig).length == 0) {
        //     res.json({
        //         status: 500,
        //         errorMessage: "ไม่มีข้อมูลการตั้งค่าการให้น้ำในโรงเรือนใดๆ",
        //         result: false
        //     });
        // } else {
        //     for (let index = 0; index < Object.keys(wateringConfig).length; index++) {
        //         let temp = wateringConfig[index];
        //         if (temp.greenHouseId == greenHouseId) {
        //             existGreenHouseIndex = index;
        //         }
        //     }
        // }
        existGreenHouseIndex = await seekGreenHouseIdIndex(wateringConfig, greenHouseId);
        if (existGreenHouseIndex == -1) {
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

function getConfigFile(req, callback) {
    // console.log("[ShowWateringConfig] getConfigFilePath: " + req.session.configFilePath);
    let config = JSON.parse(
      require("fs").readFileSync(String(req.session.configFilePath), "utf8")
    );
    // configFile = config;
    callback(config);
  }

function seekGreenHouseIdIndex(dataArray, greenHouseId) {
    let index = dataArray.findIndex(function (item, i) {
      return item.greenHouseId === greenHouseId;
    });
    return index;
  }