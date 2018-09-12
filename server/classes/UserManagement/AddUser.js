const mongoose = require('mongoose');
const user = mongoose.model('user');

let addUserResult;

export default class AddUser {

    constructor(req, res) {
        this.operation(req, res);
    }

    async operation(req, res) {
        let userId = req.body.userId;
        let farmId = req.body.farmId;
        let role = req.body.role;
        let userName = req.body.userName;
        let password = req.body.password;

        await addUser(userId, farmId, role, userName, password);
        if (addUserResult) {
            res.sendStatus(200);
        } else {
            res.sendStatus(500);
        }
    }
}

async function addUser(userId, farmId, role, userName, password) {

    let userData = new user({
        userId: userId,
        farmId: farmId,
        role: role,
        userName: userName,
        password: password

    });

    console.log(userData);

    userData.save(function (err, userData) {
        if (err) {
            addUserResult = false;
            console.log('[AddUser] addUser (err):  ' + err);
        } else if (!userData) {
            addUserResult = false;
            console.log('[AddUser] addUser (!doc):  ' + userData);
        } else {
            addUserResult = true;
        }
    })





}