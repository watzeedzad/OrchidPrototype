const mongoose = require("mongoose");
const user = mongoose.model("user");
const farm = mongoose.model("farm");
const session = require("express-session");
const fs = require("fs");

let userDataResult;
let farmDataResult;
let configFile;

export default class Login {
    constructor(req, res) {
        this.operation(req, res);
    }

    async operation(req, res) {
        let username = req.body.username;
        let password = req.body.password;
        console.log("[Login] username: " + username);
        console.log("[Login] password: " + password);
        await getUserData(username, password);
        if (typeof userDataResult === "undefined") {
            res.sendStatus(500);
        }
        // console.log("[Login] farmId: " + userDataResult.farmId);
        await getFarmData(userDataResult.farmId);
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
}

async function getUserData(username, password) {
    let result = await user.findOne({
        username: username,
        password: password
    });
    if (result) {
        console.log("[Login] getUserData, Query Pass!");
        userDataResult = result;
    } else {
        console.log("Login] getUserData, Query Failed!");
        userDataResult = undefined;
    }
}

async function getFarmData(farmId) {
    let result = await farm.findOne({
        farmId: farmId
    });
    if (result) {
        console.log("[Login] getFarmData, Query Pass!");
        farmDataResult = result;
    } else {
        console.log("[Login] getFarmData, Query Failed!");
        farmDataResult = undefined;
    }
}

function getConfigFile(configPath) {
    let config = JSON.parse(fs.readFileSync(String(configPath), "utf8"));
    configFile = config;
}