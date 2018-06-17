const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
import TemperatureCheck from "../classes/TemperatureCheck";
import GreenHouseSensor from "../classes/SaveData/GreenHouseSensor";
import ProjectSensor from "../classes/SaveData/ProjectSensor";
import SoilMoistureCheck from "../classes/SoilMoistureCheck";

let status = 0;

//Add greenHouseSensor
router.post("/greenHouseSensor", (req, res) => {
  new GreenHouseSensor(req, res);
  new TemperatureCheck(req, res);
  new SoilMoistureCheck(req, res);
  checkStatus(res);
  if (temperatureCheckStatus == 200 && soilMoistureCheckStatus == 200) {
    res.sendStatus(200);
  }
});

//Add projectSensor
router.post("/projectSensor", (req, res) => {
  new ProjectSensor(req, res);
  res.sendStatus(200);
});

function checkStatus(res) {
  let messageArray = [];
  if (temperatureCheckStatus == 500) {
    status = 500;
    messageArray.push('เกิดข้อผิดพลาดในการตรวจสอบอุณหภูมิ');
  }
  if (soilMoistureCheck == 500) {
    status  = 500;
    messageArray.push('เกิดข้อผิดพลาดในการตรวจสอบความชิ้นในเครื่องปลูก');
  }
  if (temperatureCheckStatus == 500 || soilMoistureCheckStatus == 500) {
    status = 500;
    res.json({
      status: 500,
      errorMessage: messageArray
    })
  }
}

module.exports = router;