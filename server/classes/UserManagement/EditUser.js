const mongoose = require('mongoose');
const user = mongoose.model('user');

let editUserResult;

export default class EditUser {

    constructor(req, res) {
        this.operation(req, res);
    }

    async operation(req, res) {
        console.log("[EditUser] session id: " + req.session.id);
        if (typeof req.session.farmData === "undefined" || typeof req.session.configFilePath === "undefined") {
            res.sendStatus(401);
            return;
        }

        let id = req.body._id;
        let role = req.body.role
        let firstname = req.body.firstname;
        let lastname = req.body.lastname;
        let username = req.body.username;

        await editUserData(id, firstname, lastname, username, role);

        if (editUserResult) {
            res.sendStatus(200);
        } else {
            res.sendStatus(500);
        }
    }
}

async function editUserData(id, firstname, lastname, username, role) {
    await user.findOneAndUpdate({
        _id: id
    }, {
        $set: {
            firstname: firstname,
            lastname: lastname,
            username: username,
            role: role
        }
    }, (err, doc) => {
        if (err) {
            editUserResult = false;
            console.log("[EditUser] editUserData (err): " + err);
        } else if (!doc) {
            editUserResult = false;
            console.log('[EditUser] editUserData (!doc): ' + doc);
        } else {
            editUserResult = true;
        }
    })
}