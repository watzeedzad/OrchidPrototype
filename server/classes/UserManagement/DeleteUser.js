const mongoose = require('mongoose');
const user = mongoose.model('user');

let deleteUserResult;

export default class DeleteUser {

    constructor(req, res) {
        this.operation(req, res);
    }

    async operation(req, res) {
        let userId = req.body.userId;

        await findAndDeleteUser(userId);

        if (deleteUserResult) {
            res.sendStatus(200);
        } else {
            res.sendStatus(500);
        }
    }
}

async function findAndDeleteUser(userId) {
    user.findOneAndRemove({
        userId: userId
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
    })
}