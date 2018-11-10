const mongoose = require('mongoose');
const greenHouse = mongoose.model('greenHouse');
const fs = require("fs");

export default class DeleteGreenHouse {

    constructor(req, res) {
        this.operation(req, res);
    }

    async operation(req, res) {
        console.log("[FertilizerConfig] session id: " + req.session.id);
        if (typeof req.session.farmData === "undefined" || typeof req.session.configFilePath === "undefined") {
            res.sendStatus(401);
            return;
        }

        let id = req.body.id;

        await findAndDeleteGreenHouse(id, function (deleteGreenHouseResult, doc) {
            deletePicture("../OrchidPrototype-Client/public/assets/images/greenhouse", doc.picturePath, function (result) {
                if (deleteGreenHouseResult && result) {
                    res.sendStatus(200);
                } else {
                    res.sendStatus(500);
                }
            });
        });
    }
}

async function findAndDeleteGreenHouse(id, callback) {
    let deleteGreenHouseResult = null;

    await greenHouse.findOneAndRemove({
        _id: id
    }, (err, doc) => {
        if (err) {
            deleteGreenHouseResult = false;
            console.log('[deleteGreenHouseResult] findAndDeleteGreenHouse(err): ' + err);
        } else if (!doc) {
            deleteGreenHouseResult = false;
            console.log('[deleteGreenHouseResult] findAndDeleteGreenHouse(!doc): ' + doc);
        } else {
            deleteGreenHouseResult = true;
        }
        callback(deleteGreenHouseResult, doc);
    });
}

async function deletePicture(path, fileName, callback) {
    let removeFile = path + "/" + fileName;
    let result = null;
    fs.unlink(removeFile, function (err) {
        if (err) {
            result = false;
        } else {
            result = true;
        }
        callback(result);
    })
}