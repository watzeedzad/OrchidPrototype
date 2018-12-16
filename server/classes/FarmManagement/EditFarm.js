const mongoose = require('mongoose');
const farm = mongoose.model('farm');
const knowController = mongoose.model("know_controller");

export default class EditFarm {

    constructor(req, res) {
        this.operation(req, res);
    }

    async operation(req, res) {
        let id = req.body._id
        let farmName = req.body.farmName
        let ownerName = req.body.ownerName
        let ownerSurname = req.body.ownerSurname
        let ownerTel = req.body.ownerTel
        let ownerAddress = req.body.ownerAddress
        let piMacAddress = req.body.piMacAddress

        let splitChar = piMacAddress[2];
        piMacAddress = (piMacAddress.split(splitChar)).toString();
        piMacAddress = piMacAddress.toLowerCase();

        await editFarmData(id, farmName, ownerName, ownerSurname, ownerTel, ownerAddress, piMacAddress, function (editFarmResult, doc) {
            if (editFarmResult) {
                updateKnowControllerPiMacAddress(doc.farmId, piMacAddress, function (updateKnowControllerPiMacAddressResult, doc) {
                    if (doc == null) {
                        res.sendStatus(200);
                    } else {
                        if (updateKnowControllerPiMacAddressResult) {
                            res.sendStatus(200);
                        } else {
                            res.sendStatus(500)
                        }
                    }
                });
            } else {
                res.sendStatus(500)
            }
        });
    }

}

async function editFarmData(id, farmName, ownerName, ownerSurname, ownerTel, ownerAddress, piMacAddress, callback) {
    let editFarmResult = null;

    await farm.findOneAndUpdate({
        _id: id
    }, {
        $set: {
            farmName: farmName,
            ownerName: ownerName,
            ownerSurname: ownerSurname,
            ownerTel: ownerTel,
            ownerAddress: ownerAddress,
            piMacAddress: piMacAddress
        }
    }, (err, doc) => {
        if (err) {
            editFarmResult = false;
            console.log('[EditFarm] editFarmData(err) : ' + err);
        } else if (!doc) {
            editFarmResult = false;
            doc = null;
            console.log('[EditFarm] editFarmData(!doc) : ' + doc)
        } else {
            editFarmResult = true;
        }
        callback(editFarmResult, doc);
    });
}

async function updateKnowControllerPiMacAddress(farmId, newPiMacAddress, callback) {
    let updateKnowControllerPiMacAddressResult;
    await knowController.update({
        farmId: farmId
    }, {
        $set: {
            piMacAddress: newPiMacAddress
        }
    }, {
        multi: true
    }, function (err, doc) {
        if (err) {
            updateKnowControllerPiMacAddressResult = false;
        } else {
            updateKnowControllerPiMacAddressResult = true;
        }
        callback(updateKnowControllerPiMacAddressResult, doc);
    });
}