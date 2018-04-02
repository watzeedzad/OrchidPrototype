const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const farm = mongoose.model("farm");

var filePathJson;
var filePath;

// function getFarmData(farmIdIn) {
//     var tempData;
//     var farmData = farm.find({
//         farmId: farmIdIn
//     }, (err, farmData) => {
//         if (!err) {
//             tempData = JSON.stringify(farmData);
//             console.log("tempData: " + tempData);
//             return tempData;
//             callback();
//         } else {
//             console.log("ERROR");
//         }
//     }).exec();
//     return tempData;
// }

async function getFarmData(farmIdIn) {
    var farmData = await farm.find({
        farmId: farmIdIn
    });

    if (farmData) {
       let tempData = JSON.stringify(farmData);
        console.log(tempData);
        return tempData.JSON;
    } else {
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
    var temp =  getFarmData(123456789) ;
        console.log("temp: " + temp);
        filePath = temp.configFilePath;
        console.log("filePathJson: " + filePathJson)
        console.log("filePath: " + filePath);
        res.json(temp);

    // filePathJson = getFarmData(125468958);
    // var temp = getFarmData(123456789);
});

module.exports = router;