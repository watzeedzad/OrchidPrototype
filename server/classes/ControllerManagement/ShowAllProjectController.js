const mongoose = require("mongoose");
const knowController = mongoose.model('know_controller');

let showProjectControllerData = undefined;

export default class showAllProjectController {

    constructor(req, res) {
        operation(req, res);
    }
}
async function operation(req, res) {
    console.log("[ShowAllProjectController] session id: " + req.session.id);
    if (typeof req.session.farmData === "undefined" || typeof req.session.configFilePath === "undefined") {
        res.sendStatus(401);
        return;
    }

    let farmId = req.session.farmId;
    let greenHouseId = req.body.greenHouseId;
    // let projectId = req.body.projectId;

    if (typeof farmId === "undefined" || typeof greenHouseId === "undefined") {
        res.json({
            status: 500,
            errorMessage: "เกิดข้อผิดพลาดในการเเสดงข้อมูล Project Controller ทั้งหมด"
        });
        return;
    }
    showProjectControllerData = await getProjectControllerData(farmId, greenHouseId);

    // // if (showProjectControllerData == null) {
    // //     res.json({
    // //         status: 500,
    // //         errorMessage: "เกิดข้อผิดพลาดในการเเสดงข้อมูล Project Controller ทั้งหมด"
    // //     });
    // //     return;
    // // } else if (showProjectControllerData.length == 0) {
    //     res.json({
    //         status: 500,
    //         errorMessage: "เกิดข้อผิดพลาดไม่มีข้อมูล Project Controller"
    //     });
    //     return;
    // }

    if (showProjectControllerData.length == 0) {
        res.json({
            status: 500,
            errorMessage: "เกิดข้อผิดพลาดไม่มีข้อมูล Project Controller"
        });
        return;
    }

    let allProjectControllerData = [];
    let currentArrayIndex = 0;

    for (let index = 0; index < showProjectControllerData.length; index++) {
        if (index == 0) {
            let temp = {
                projectId: showProjectControllerData[index].projectId,
                controllerData: []
            }
            temp.controllerData.push(showProjectControllerData[index]);
            allProjectControllerData.push(temp);
        } else if (showProjectControllerData[index].projectId != showProjectControllerData[index - 1].projectId) {
            let temp = {
                projectId: showProjectControllerData[index].projectId,
                controllerData: []
            }
            temp.controllerData.push(showProjectControllerData[index]);
            allProjectControllerData.push(temp);
            currentArrayIndex++;
        } else {
            allProjectControllerData[currentArrayIndex].controllerData.push(showProjectControllerData[index]);
        }
    }

    // showProjectControllerData.sort(function (a, b) {
    //     return a.projectId - b.projectId
    // });

    res.json(allProjectControllerData);

}

async function getProjectControllerData(farmId, greenHouseId) {
    let result = await knowController.find({
        farmId: farmId,
        greenHouseId: greenHouseId,
        projectId: {
            $ne: null
        }
    }, null, {
        sort: {
            projectId: 1
        }
    }, (err, result) => {
        if (err) {
            showProjectControllerData = null;
            console.log("[showProjectControllerData] getProjectControllerData(err): " + err);
        } else if (!result) {
            showProjectControllerData = null;
            console.log("[showProjectControllerData] getProjectControllerData(!result): " + result);
        } else {
            showProjectControllerData = result;
        }
    });
    return result;
}