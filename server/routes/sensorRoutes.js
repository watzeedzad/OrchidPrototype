const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
import TemperatureCheck from "../classes/TemperatureCheck";
import GreenHouseSensor from "../classes/SaveData/GreenHouseSensor";
import ProjectSensor from "../classes/SaveData/ProjectSensor";
import SoilMoistureCheck from "../classes/SoilMoistureCheck";

//Add greenHouseSensor
router.post("/greenHouseSensor", (req, res) => {
  new GreenHouseSensor(req, res);
  new TemperatureCheck(req, res);
  checkStatus('เกิดข้อผิดพลาดในการตรวจสอบอุณหภูมิ', res);
  new SoilMoistureCheck(req, res);
  checkStatus('เกิดข้อผิดพลาดในการตรวจสอบความชิ้นในเครื่องปลูก', res);
  if (greenHouseSensorRouteStatus == 200) {
    res.sendStatus(200);
  }
});

//Add projectSensor
router.post("/projectSensor", (req, res) => {
  new ProjectSensor(req, res);
  res.sendStatus(200);
});

function checkStatus(message, res) {
  if (greenHouseSensorRouteStatus == 500) {
    res.json({
      status: 500,
      message: message
    })
  }
}

module.exports = router;