const mongoose = require('mongoose');
const user = mongoose.model('user');

let addUserResult;

export default class AddUser {

    constructor(req, res) {
        this.operation(req, res);
    }

    async operation(req, res) {
        console.log("[AddUser] session id: " + req.session.id);
        if (typeof req.session.farmData === "undefined" || typeof req.session.configFilePath === "undefined") {
            res.sendStatus(401);
            return;
        }
        
        let farmId = req.body.farmId;
        let role = req.body.role;
        let firstname = req.body.firstname;
        let lastname = req.body.lastname;
        let username = req.body.username;
        let password = req.body.password;

        await addUser(farmId, firstname, lastname, role, username, password);
        if (addUserResult) {
            res.sendStatus(200);
        } else {
            res.sendStatus(500);
        }
    }
}

async function addUser(farmId, firstname, lastname, role, username, password) {

    let userData = new user({
        farmId: farmId,
        role: role,
        firstname: firstname,
        lastname:lastname,
        username: username,
        password: password

    });

    console.log(userData);

    userData.save(function (err, doc) {
        if (err) {
            addUserResult = false;
            console.log('[AddUser] addUser (err):  ' + err);
        } else if (!doc) {
            addUserResult = false;
            console.log('[AddUser] addUser (!doc):  ' + doc);
        } else {
            addUserResult = true;
        }
    })





}