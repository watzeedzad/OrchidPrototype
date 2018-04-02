const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const fs = require("fs");
const http = require("http");
const farm = mongoose.model("farm");

let filePathJson;
let filePath;
let configFile;
let minTemperature;
let maxTemperature;

async function getFarmData(farmIdIn) {
    var farmData = await farm.find({
        farmId: farmIdIn
    });
    if (farmData) {
        filePathJson = JSON.stringify(farmData);
    } else {
        console.log('fail');
    }
}

function compareTemperature(filePath, currentTemp) {
    configFile = JSON.parse(require('fs').readFileSync(String(filePath), 'utf8'));
    minTemperature = configFile.minTemperature;
    maxTemperature = configFile.maxTemperature;
    let options = {
        host: "",
        path: ""
    }
    if (maxTemperature > currentTemp) {

    } else {

    }
}

router.post("/", (req, res) => {
    async function getPathData() {
        await getFarmData(123456789);
        const temp = JSON.parse(filePathJson);
        filePath = temp[0].configFilePath;
        console.log("filePath: " + filePath);
        await compareTemperature(filePath, req.body.temperature);
        res.sendStatus(200);
    }
    getPathData();
});

module.exports = router;