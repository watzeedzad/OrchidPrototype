const mongoose = require('mongoose');
const knowController = mongoose.model('know_controller');

let showGreenHouseControllerData;

export default class ShowAllGreenHouseController {

    constructor(req, res) {
        this.process(req, res);
    }

    async process(req, res) {
        console.log("[showGreenHouseControllerData] session id: " + req.session.id);
        if (typeof req.session.farmData === "undefined" || typeof req.session.configFilePath === "undefined") {
            console.log(req.session.farmData+" / "+req.session.configFilePath)
            res.sendStatus(500);
            return;
        }
        let farmId = req.body.farmId;

        if (typeof farmId === "undefined") {
            res.json({
                status: 500,
                errorMessage: "เกิดข้อผิดพลาดในการเเสดงข้อมูลGreenHouseControllerทั้งหมด"
            });
            return;
        }
        await getGreenHouseControllerData(farmId);
        if (typeof showGreenHouseControllerData === "undefined") {
            res.json({
                status: 500,
                errorMessage: "เกิดข้อผิดพลาดไม่มีข้อมูลGreenHouse Controller"
            });
            return;
        }

        showGreenHouseControllerData.sort(function(a, b){return a.greenHouseId - b.greenHouseId});

        let farm = [];
        let greenHouse = [];
        greenHouse.push(showGreenHouseControllerData[0]);
        farm.push(greenHouse);
        for (let i = 1; i < showGreenHouseControllerData.lenghth; i++) {
            let controllerData = showGreenHouseControllerData[i];
            for (let j = 0; j < farm.length; j++) {
                if (controllerData.greenHouseId === farm[j][0].greenHouseId) {
                    farm[j].push(controllerData);
                    break;
                } else if (j === farm.length - 1) {
                    let greenHouse = [];
                    greenHouse.push(controllerData);
                    farm.push(greenHouse);
                    break;
                }
            }
        }

        res.json(farm);
    }

}



async function getGreenHouseControllerData(farmId) {
    await knowController.find({
        farmId: farmId,
        greenHouseId: {$ne: null}
    }, (err, result) => {
        if (err) {
            showGreenHouseControllerData = undefined;
            console.log("[showGreenHouseControllerData] getControllerData (err):  " + err);
        } else if (!result) {
            showGreenHouseControllerData = undefined;
            console.log("[showGreenHouseControllerData getControllerData(!result): " + result);
        } else {
            showGreenHouseControllerData = result;
        }
    });
}