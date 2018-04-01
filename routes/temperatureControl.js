const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const farm = mongoose.model("farm");

var filePathJson;
var filePath;

async function getFarmData(farmIdIn) {
    await farm.find({
        farmId: farmIdIn
    }, function (err, farm) {
        if (!err) {
            // pathJson.json(farm);
            console.log("success");
        } else {
            console.log("fail");
        }
    });
}

router.post("/", (req, res) => {
    getFarmData(125468958);
    console.log(filePath);
    console.log(filePathJson);
});

router.get("/", (req, res) => {
    filePathJson = getFarmData(125468958);
    // filePath = filePathJson.confileFilePath;
    // console.log(filePath);
    console.log(filePathJson);
});

module.exports = router;