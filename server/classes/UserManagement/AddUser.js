const mongoose = require('mongoose');
const crypto = require("crypto");
const user = mongoose.model('user');

let isExistUser;

export default class AddUser {

    constructor(req, res) {
        this.operation(req, res);
    }

    async operation(req, res) {
        console.log("[AddUser] session id: " + req.session.id);

        let farmId = req.session.farmId;
        if (typeof farmId === "undefined"){
            farmId = req.body.farmId
        }
        let role = req.body.role;
        let firstname = req.body.firstname;
        let lastname = req.body.lastname;
        let username = req.body.username;
        let password = req.body.password;

        if (
            typeof farmId === "undefined" ||
            typeof role === "undefined" ||
            typeof firstname === "undefined" ||
            typeof lastname === "undefined" ||
            typeof username === "undefined" ||
            typeof password === "undefined") {
            res.json({
                "errorStatus": 500,
                "errorMessage": "เกิดข้อผิดพลาดในการเพิ่มผู้ใช้ใหม่"
            })
        }

        isExistUser = await isUsernameExist(farmId, username);
        if (isExistUser != null) {
            res.json({
                "status": 500,
                "errorMessage": "เกิดข้อผิดพลาดในการเพิ่มผู้ใช้ใหม่ มึชื่อบัญชีผู้ใช้อยู่แล้ว"
            });
            return;
        }

        let hash = crypto.createHash('sha512');
        hash.update(password);
        password = hash.digest('hex');
        console.log("[Login] passwordCipherHash (sha512): " + password);

        addUserResult = await addUser(farmId, firstname, lastname, role, username, password, function (addUserResult) {
            if (addUserResult) {
                res.sendStatus(200);
            } else {
                res.sendStatus(500);
            }
        });
    }
}

async function addUser(farmId, firstname, lastname, role, username, password, callback) {
    let addUserResult = null;

    let userData = new user({
        // userId: userId,
        farmId: farmId,
        role: role,
        firstname: firstname,
        lastname: lastname,
        username: username,
        password: password

    });

    // console.log(userData);

    await userData.save(function (err) {
        if (err) {
            addUserResult = false;
            console.log('[AddUser] addUser (err):  ' + err);
        } else {
            addUserResult = true;
            console.log("[AddUser] addUser succesfully!");
        }
        callback(addUserResult);
    });
}

async function isUsernameExist(farmId, username) {
    let result = await user.findOne({
        farmId: farmId,
        username: username
    }, function (err, result) {
        if (err) {
            console.log("[AddUser] isUsernameExist (err): " + err);
            isExistUser = null;
        } else if (!result) {
            console.log("[AddUser] isUsernameExist (!result): " + result);
            isExistUser = null;
        } else {
            // console.log("[AddUser] isUsernameExist (result): " + result);
            isExistUser = result;
        }
    });
    return result;
}