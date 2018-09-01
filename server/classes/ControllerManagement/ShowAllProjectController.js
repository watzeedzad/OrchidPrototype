const mongoose = require("mongoose");
const knowController = mongoose.model('know_controller');

let showProjectControllerData;

export default class showAllProjectController {

    constructor(req, res) {
        this.operation(req, res);
    }

    async operation(req, res) {
        console.log("[showGreenHouseControllerData] session id: " + req.session.id);
        if (typeof req.session.farmData === "undefined" || typeof req.session.configFilePath === "undefined") {
            res.sendStatus(500);
            return;
        }

        let farmId = req.body.farmId;
        let controllerType = req.body.controllerType;

        if (typeof farmId === "undefined") {
            res.json({
                status: 500,
                errorMessage: "เกิดข้อผิดพลาดในการเเสดงข้อมูลProject Controllerทั้งหมด"
            });
            return;
        }

        await getProjectControllerData(farmId, controllerType);
        if (typeof showProjectControllerData === "undefined") {
            res.json({
                status: 500,
                errorMessage: "เกิดข้อผิดพลาดไม่มีข้อมูลProject Controller"
            });
            return;
        }

        showProjectControllerData.sort(function(a, b){return a.projectId - b.projectId});

        let greenHouse = [];
        let project = [];
        project.push(showProjectControllerData[0]);
        greenHouse.pugh(project)
        for (let i = 1; i < showProjectControllerData.lenghth; i++) {
            let controllerData = showProjectControllerData[i];
            for (let j = 0; j < greenHouse.length; j++) {
                if (controllerData.projectId === greenHouse[j][0].projectId) {
                    greenHouse[j].push(controllerData);
                    break;
                } else if (j === greenHouse.length - 1) {
                    let project = [];
                    project.push(controllerData);
                    greenHouse.push(project);
                    break;
                }
            }
        }

        res.json(greenHouse);
    }

}

async function getProjectControllerData(farmId, controllerType) {
    await knowController.find({
        farmId: farmId,
        controllerType: controllerType
    }, (err, result) => {
        if (err) {
            projectControllerData = undefined;
            console.log("[showProjectControllerData] getProjectControllerData(err): " + err);
        } else if (!result) {
            projectControllerData = undefined;
            console.log("[showProjectControllerData] getProjectControllerData(!result): " + result);
        } else {
            showProjectControllerData = result;
        }
    });
}