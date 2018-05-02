const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const user = mongoose.model("user");
const farm = mongoose.model("farm");

let userDataResult;
let farmDataResult;

async function getUserData(username, password) {
    let result = await user.findOne({
        username: username,
        password: password
    });
    if (result) {
        console.log("Query Pass!");
        userDataResult = result;
    } else {
        console.log("Query Failed!");
        userDataResult = undefined;
    }
    console.log("userResult: " + userDataResult);
}

async function getFarmData(farmId) {
    let result = await farm.findOne({
        farmId: farmIdGlobal
    });
    if (result) {
        console.log("Query Pass!");
        farmDataResult = result;
    } else {
        console.log("Query Failed!");
        farmDataResult = undefined;
    }
    console.log("userResult: " + farmDataResult);
}

router.use("/", (req, res, next) => {
    console.log(origin_url);
    res.setHeader("Access-Control-Allow-Origin", origin_url);
    res.setHeader(
        "Access-Control-Allow-Headers",
        "X-Requested-With,content-type"
    );
    res.set("Content-Type", "application/json");
    next();
});

router.post("/", (req, res) => {
    async function checkUser() {
        let username = req.body.username;
        let password = req.body.password;
        console.log("username: " + username);
        console.log("password: " + password);
        await getUserData(username, password);
        if (typeof userDataResult === "undefined") {
            res.sendStatus(500);
        } else {
            farmIdGlobal = userDataResult.farmId;
        }
        await getFarmData(farmIdGlobal);
        pathGlobal = farmDataResult.configFilePath;
        res.json(userDataResult);
    }
    checkUser();
});

module.exports = router;