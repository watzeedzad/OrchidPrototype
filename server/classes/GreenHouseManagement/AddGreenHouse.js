const mongoose = require('mongoose');
const greenHouse = mongoose.model('greenHouse');

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

        let farmId = req.session.farmId;
        let name = req.body.name;
        let desc = req.body.desc;
        let picturePath = req.body.picturePath;

        await addGreenHouse(farmId, name, desc, picturePath, function (addGreenHouseResult) {
            if (addGreenHouseResult) {
                res.sendStatus(200);
            } else {
                res.sendStatus(500);
            }
        });
    }
}

async function addGreenHouse(farmId, name, desc, picturePath, callback) {
    let addGreenHouseResult = null;

    let greenHouseData = new greenHouse({
        farmId: farmId,
        name: name,
        desc: desc,
        picturePath: picturePath,
    });

    await greenHouseData.save(function (err, doc) {
        if (err) {
            addGreenHouseResult = false;
            console.log('[AddGreenHouse] addGreenHouse(err):  ' + err);
        } else if (!doc) {
            addGreenHouseResult = false;
            console.log('[AddGreenHouse] addGreenHouse(!doc):  ' + dox);
        } else {
            addGreenHouseResult = true;
        }
        callback(addGreenHouseResult);
    })


}