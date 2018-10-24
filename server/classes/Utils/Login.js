const mongoose = require("mongoose");
const crypto = require("crypto");
const sha256 = require("js-sha256").sha256;
const user = mongoose.model("user");
const farm = mongoose.model("farm");
const fs = require("fs");

let userDataResult;
let farmDataResult;
let configFile;

export default class Login {
    constructor(req, res) {
        operation(req, res);
    }
}

async function operation(req, res) {
    let username = req.body.username;
    let password = req.body.password;
    let key = crypto.createCipher("aes-256-gcm", aes256_key);
    let passwordCipher = key.update(password, "utf8", "hex");
    console.log("[AddUser] passwordCipher (aes256): " + passwordCipher);
    let passwordCipherHash = sha256(passwordCipher);
    console.log("[AddUser] passwordCipherHash (ase256 /w sha256): " + passwordCipherHash);
    password = passwordCipherHash;
    userDataResult = await getUserData(username, password);
    if (userDataResult == null) {
        res.sendStatus(401);
        return;
    }
    // console.log("[Login] farmId: " + userDataResult.farmId);
    farmDataResult = await getFarmData(userDataResult.farmId);
    await getConfigFile(farmDataResult.configFilePath);
    // console.log("[Login] farmDataResult: " + farmDataResult);
    req.session.farmData = farmDataResult;
    req.session.configFile = configFile;
    req.session.configFilePath = farmDataResult.configFilePath;
    req.session.farmId = farmDataResult.farmId;
    // console.log("[Login] req.session.farmData: " + req.session.farmData);
    // console.log("[Login] req.session.configFilePath: " + req.session.configFilePath);
    res.sendStatus(200);
    console.log("[Login] session id: " + req.session.id);
    console.log("[Login] cookie: " + req.cookies);
}

async function getUserData(username, password) {
    let result = await user.findOne({
        username: username,
        password: password
    });
    if (result) {
        console.log("[Login] getUserData, Query Pass!");
    } else {
        console.log("Login] getUserData, Query Failed!");
    }
    return result;
}

async function getFarmData(farmId) {
    let result = await farm.findOne({
        farmId: farmId
    });
    if (result) {
        console.log("[Login] getFarmData, Query Pass!");
    } else {
        console.log("[Login] getFarmData, Query Failed!");
    }
    return result;
}

function getConfigFile(configPath) {
    let config = JSON.parse(fs.readFileSync(String(configPath), "utf8"));
    configFile = config;
}