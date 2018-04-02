const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const farm = mongoose.model("farm");

var filePathJson;
var filePath;

async function getFarmData(farmIdIn){
    var farmData = await farm.find({farmId: farmIdIn});
    if(farmData){
        filePathJson =  JSON.stringify(farmData);
    }else{
        console.log('fail');
    }
}

router.post("/", (req, res) => {
    const newFarm = {
        farmId: 123456789,
        farmName: "Proto X",
        ownerName: "Hot",
        ownerSurname: "Head",
        ownerTel: "123-456-789",
        ownerAddress: "UNKNOW",
        configFilePath: "./conf/farm-1.json"
    };

    new farm(newFarm).save(function (err) {
        if (!err) {
            console.log("created");
            res.sendStatus(200);
        } else {
            //TODO: return page with errors
            return console.log(err);
        }
    });
});

router.get("/", (req, res) => {
    async function getPathData(){
        await getFarmData(123456789);
        const temp = JSON.parse(filePathJson);
        filePath = temp[0].configFilePath;
        console.log("filePath: " + filePath)
        res.sendStatus(200);
    }
    getPathData();
});

module.exports = router;