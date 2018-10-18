const mongoose = require('mongoose');
const greenHouse = mongoose.model('greenHouse');

let addGreenHouseResult;

export default class AddGreenHouse {

    constructor(req, res) {
        this.operation(req, res);
    }

    async operation(req, res) {
        console.log("[FertilizerConfig] session id: " + req.session.id);
        if (typeof req.session.farmData === "undefined" || typeof req.session.configFilePath === "undefined") {
            res.sendStatus(401);
            return;
        }

        let greenHouseId = req.body.greenHouseId;
        let farmId = req.body.farmId;
        let name = req.body.name;
        let desc = req.body.desc;
        let picturePath = req.body.picturePath;

        await addGreenHouse(greenHouseId, farmId, name, desc, picturePath);

        if (addGreenHouseResult) {
            res.sendStatus(200);
        } else {
            res.sendStatus(500);
        }

    }

}

async function addGreenHouse(greenHouseId, farmId, name, desc, picturePath) {

    let greenHouseData = new greenHouse({

        greenHouseId: greenHouseId,
        farmId: farmId,
        name: name,
        desc: desc,
        picturePath: picturePath,
    });

    console.log(greenHouseData);

    greenHouseData.save(function (err, doc) {
        if (err) {
            addGreenHouseResult = false;
            console.log('[AddGreenHouse] addGreenHouse(err):  ' + err);
        } else if (!doc) {
            addGreenHouseResult = false;
            console.log('[AddGreenHouse] addGreenHouse(!doc):  ' + dox);
        } else {
            addGreenHouseResult = true;
        }
    })


}