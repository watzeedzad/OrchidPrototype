const mongoose = require('mongoose');
const crypto = require("crypto");
const sha256 = require("js-sha256").sha256;
const user = mongoose.model('user');

let addUserResult;
let isExistUser;

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

        // let userId = req.body.userId;
        let farmId = req.body.farmId;
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

        let key = crypto.createCipher("aes-256-gcm", aes256_key);
        let passwordCipher = key.update(password, "utf8", "hex");
        console.log("[AddUser] passwordCipher (aes256): " + passwordCipher);
        let passwordCipherHash = sha256(passwordCipher);
        console.log("[AddUser] passwordCipherHash (ase256 /w sha256): " + passwordCipherHash);
        password = passwordCipherHash;

        addUserResult = await addUser(farmId, firstname, lastname, role, username, password);
        setTimeout(() => {
            if (addUserResult) {
                res.sendStatus(200);
            } else {
                res.sendStatus(500);
            }
        }, 200);
    }
}

async function addUser(farmId, firstname, lastname, role, username, password) {
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