const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const user = mongoose.model("user");

let userDataResult

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

router.use("/", (req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
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
            res.json(userDataResult);
        }
    }
    checkUser();
});

module.exports = router;