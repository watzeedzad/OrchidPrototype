const mongoose = require('mongoose');
const user = mongoose.model('user');

export default class DeleteUser {

    constructor(req, res) {
        this.operation(req, res);
    }

    async operation(req, res) {
        console.log("[DeleteUser] session id: " + req.session.id);
        if (typeof req.session.farmData === "undefined" || typeof req.session.configFilePath === "undefined") {
            res.sendStatus(401);
            return;
        }

        let id = req.body.id;

        await findAndDeleteUser(id, function (deleteUserResult) {
            if (deleteUserResult) {
                res.sendStatus(200);
            } else {
                res.sendStatus(500);
            }
        });
    }
}

async function findAndDeleteUser(id, callback) {
    let deleteUserResult = null;

    await user.findOneAndRemove({
        _id: id
    }, (err, doc) => {
        if (err) {
            deleteUserResult = false;
            console.log('[deleteUserResult] findAndDeleteUser(err): ' + err);
        } else if (!doc) {
            deleteUserResult = false;
            console.log('[deleteUserResult] findAndDeleteUser(!doc): ' + doc);
        } else {
            deleteUserResult = true;
        }
        callback(deleteUserResult);
    })
}