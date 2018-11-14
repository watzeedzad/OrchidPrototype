'use strict';
const mongoose = require("mongoose");
const crypto = require('crypto');
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
    let hash = crypto.createHash('sha512');
    hash.update(password);
    password = hash.digest('hex');
    console.log("[Login] passwordCipherHash (sha512): " + password);
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
    req.session.configFilePath = farmDataResult.configFilePath;
    req.session.farmId = farmDataResult.farmId;
    // console.log("[Login] req.session.farmData: " + req.session.farmData);
    // console.log("[Login] req.session.configFilePath: " + req.session.configFilePath);
    res.sendStatus(200);
    console.log("[Login] session id: " + req.session.id);
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