const mongoose = require("mongoose");
const greenHouse = mongoose.model('greenHouse');

let greenHouseDataResult;

export default class IsAutoFertilizering {
    constructor(req, res) {
        operation(req, res)
    }
}

async function operation(req, res) {
    console.log("[IsAutoFertilizering] session id: " + req.session.id);
        if (typeof req.session.farmData === "undefined" || typeof req.session.configFilePath === "undefined") {
            res.sendStatus(401);
            return;
        }

        let greenHouseId = req.body.greenHouseId;
        if (typeof greenHouseId === "undefined") {
            res.sendStatus(500);
            return;
        }

        greenHouseDataResult = await getGreenHouseData(greenHouseId);
        if (greenHouseDataResult == null) {
            req.sendStatus(500);
            return;
        }
        res.json({
            greenHouseId: greenHouseId,
            isAutoWatering: greenHouseDataResult.isAutoWatering
        })
        
}

async function getGreenHouseData(greenHouseId) {
    let result = await greenHouse.findOne({
        greenHouseId: greenHouseId
    }, (err, result) => {
        if(err) {
            greenHouseDataResult = null;
            console.log("[IsAutoWatering] getGreenHouseData (err): " + err);
        } else if (!result) {
            greenHouseDataResult = null;
            console.log("[IsAutoWatering] getGreenHouseData (!result): " + result)
        } else {
            greenHouseDataResult = result;
        }
    });
    return result;
}