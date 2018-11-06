const mongoose = require('mongoose');
const farm = mongoose.model('farm');

export default class EditFarm {

    constructor(req, res) {
        this.operation(req, res);
    }

    async operation(req, res) {
        let id = req.body.id
        let farmName = req.body.farmName
        let ownerName = req.body.ownerName
        let ownerSurname = req.body.ownerSurname
        let ownerTel = req.body.ownerTel
        let ownerAddress = req.body.ownerAddress
        let pimac = req.body.pimac

        await editFarmData(id, farmName, ownerName, ownerSurname, ownerTel, ownerAddress, pimac, function (editFarmResult) {
            if (editProjectResult) {
                res.sendStatus(200);
            } else {
                res.sendStatus(500)
            }
        });
    }

}

async function editFarmData(id, farmName, ownerName, ownerSurname, ownerTel, ownerAddress, pimac, callback) {
    let editFarmResult = null;

    await farm.findOme({
        _id: id
    }, {
        $set: {
            farmName: farmName,
            ownerName: ownerName,
            ownerSurname: ownerSurname,
            ownerTel: ownerTel,
            ownerAddress: ownerAddress,
            pimac: pimac
        }
    }, (err, doc) => {
        if (err) {
            editFarmResult = false;
            console.log('[EditFarm] editFarmData(err) : ' + err);
        } else if (!doc) {
            editFarmResult = false;
            console.log('[EditFarm] editFarmData(!doc) : ' + doc)
        } else {
            editFarmResult = true;
        }
        callback(editFarmResult);
    });
}