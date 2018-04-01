const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const GreenHouse = mongoose.model("greenHouse");

router.post("/addGreenHouse",(req,res)=>{
    const newGreenHouse = {
        greemHouseId : req.body.greemHouseId,
        farmId : req.body.farmId,
        name : req.body.String,
        desc : req.body.desc,
        picturePath : req.body.picturePath
    }

    new GreenHouse(newGreenHouse)
    .save
    .then(err =>{
        if(!err){
        console.log("created");
        res.sendStatus(200);
        }else{
            return console.log(err);
        }
    });
});

router.get("/showGreenHouse", (req,res)=>{
    Greenhouse.find((err,greenHouseDataList)=>{
        if(!err){
            res.json(greenHouseDataList);
        }else{
            res.json({});
        }
    });
});

module.exports = router;