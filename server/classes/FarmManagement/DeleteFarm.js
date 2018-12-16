const mongoose = require('mongoose');
const farm = mongoose.model('farm');

export default class DeleteFarm {

    constructor(req, res) {
        this.operation(req, res);
    }

    async operation(req, res) {
        let id = req.body.id;

        await findAndDeleteFarm(id, function (deleteFarmResult) {
            if (deleteFarmResult) {
                res.sendStatus(200);
            } else {
                res.sendStatus(500);
            }
        });
    }
}

async function findAndDeleteFarm(id, callback) {
    let deleteFarmResult = null;

    await farm.findOneAndRemove({
        _id: id
    }, (err, doc) => {
        if (err) {
            deleteFarmResult = false
            console.log('[DeleteFarm] findAndDeleteFarm: ' + err);
        } else if (!doc) {
            deleteFarmResult = false
            console.log('[DeleteFarm] findAndDeleteFarm: ' + doc);
        } else {
            deleteFarmResult = true;
        }
        callback(deleteFarmResult);
    })
}