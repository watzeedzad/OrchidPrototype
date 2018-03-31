const express = require('express');
const router = express.router();
const mongoose = require('mongoose');
const greenHouseSensor = mongoose.model('greenHouse_Sensor');
const projectSensor =  mongoose.model('project_Sensor');

//Add greenHouseSensor
router.post('/', (req,res) =>{
    const newGreenHouseData = {
        greenHouseSensorId : req.body.greenHouseId,
        temperature : req.body.temperature,
        humidity : req.body.humidity ,
        soilMoisture : req.body.soilMoisture,
        ambientLight : req.body.ambientLight,
        timeStamp : req.body.timeStamp,
        greenHouseId : req.body.greenHouseId
    }

    new greenHouseSensor(newGreenHouseData)
    .save
    .then((err) =>{
        if(err){
            return handleError(err);
        }
    })
})

//Show greenHouseSensorData
router.get('/showGreenHouseSensor',(req,res)=>{
    greenHouseSensor.find((err,greenHouseDataList) => {
        if(!err){
            res.json(greenHouseDataList);
        }else{
            res.json({});
        }
    })
})

//Add projectSensor
router.post('/',(req,res)=>{
    const newProjectSensorData = {
        projectSensorId : req.body.projectSensorId,
        soilFertilizer : req.body.soilFertilizer,
        timeStamp : req.body.timeStamp,
        projectId : req.body.projectId
    }

    new projectSensor(newProjectSensorData)
    .save
    .then((err)=>{
        if(err){
            return handleError(err);
        }
    })
})

//Show Project Sensor Data
router.get('/showProjectData',(req,res)=>{
    projectSensor.find((err,projectDataList)=>{
        if(!err){
            res.json(projectDataList);
        }else{
            res.json({});
        }
    })
})