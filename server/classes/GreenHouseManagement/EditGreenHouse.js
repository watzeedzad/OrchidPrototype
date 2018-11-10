const mongoose = require('mongoose');
const greenHouse = mongoose.model('greenHouse');
const fs = require("fs");

export default class EditGreenHouse {

    constructor(req, res) {
        this.operation(req, res);
    }

    async operation(req, res) {
        console.log("[FertilizerConfig] session id: " + req.session.id);
        if (typeof req.session.farmData === "undefined" || typeof req.session.configFilePath === "undefined") {
            res.sendStatus(401);
            return;
        }

        let id = req.headers.id;
        let name = req.headers.name;
        let desc = req.headers.desc;
        let picturePath;

        if (typeof req.file === "undefined") {
            picturePath = null;
        } else {
            picturePath = req.file.filename;
        }

        await findOneAndUpdateGreenHouse(id, name, desc, picturePath, function (editGreenHouseResult, doc) {
            if (typeof req.file === "undefined") {
                if (editGreenHouseResult) {
                    res.sendStatus(200);
                    return;
                } else {
                    res.sendStatus(500);
                    return;
                }
            } else {
                deleteOldPicture(req.file.destination, doc.picturePath, function (result) {
                    if (editGreenHouseResult && result) {
                        res.sendStatus(200);
                    } else {
                        res.sendStatus(500);
                    }
                });
            }
        });
    }

}

async function findOneAndUpdateGreenHouse(id, name, desc, picturePath, callback) {
    let editGreenHouseResult = null;

    await greenHouse.findOneAndUpdate({
        _id: id
    }, {
        $set: {
            name: name,
            desc: desc,
            picturePath: picturePath
        }
    }, (err, doc) => {
        if (err) {
            editGreenHouseResult = false;
            console.log("[editGreenHouseResult] findOneAndUpdateGreenHouse (err): " + err);
        } else if (!doc) {
            editGreenHouseResult = false;
            console.log("[editGreenHouseResult] findOneAndUpdateGreenHouse (!doc): " + doc);
        } else {
            editGreenHouseResult = true;
        }
        callback(editGreenHouseResult, doc);
    });
}

async function deleteOldPicture(path, fileName, callback) {
    let removeFile = path + "/" + fileName;
    let result = null;
    fs.unlink(removeFile, function (err) {
        if (err) {
            result = false;
        } else {
            result = true;
        }
        callback(result);
    });
}