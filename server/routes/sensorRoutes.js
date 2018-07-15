const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
import TemperatureCheck from "../classes/TemperatureCheck";
import GreenHouseSensor from "../classes/SaveData/GreenHouseSensor";
import ProjectSensor from "../classes/SaveData/ProjectSensor";
import SoilMoistureCheck from "../classes/SoilMoistureCheck";
import FertilityCheck from "../classes/FertilityCheck";

let status = 0;

//Add greenHouseSensor
router.post("/greenHouseSensor", (req, res) => {
  req.session.temperatureCheckStatus = 0;
  req.session.soilMoistureCheckStatus = 0;
  new GreenHouseSensor(req, res);
  new TemperatureCheck(req, res);
  new SoilMoistureCheck(req, res);
  if (req.session.temperatureCheckStatus == 200 && req.session.soilMoistureCheckStatus == 200) {
    res.sendStatus(200);
  } else {
    checkStatus(req, res, "greenHouse");
  }
});

//Add projectSensor
router.post("/projectSensor", (req, res) => {
  async function doThis(req, res) {
    req.session.fertilityCheckStatus = 0;
    new ProjectSensor(req, res);
    await new FertilityCheck(req, res);
    await checkStatus(req, res, "project");
    if (req.session.fertilityCheckStatus == 200) {
      res.sendStatus(200);
    }
  }
  doThis();
});

function checkStatus(req, res, checkType) {
  console.log("start check status");
  let messageArray = [];
  if (checkType == "greenHouse") {
    if (req.session.temperatureCheckStatus == 500) {
      messageArray.push('เกิดข้อผิดพลาดในการตรวจสอบอุณหภูมิ');
    }
    if (req.session.soilMoistureCheckStatus == 500) {
      messageArray.push('เกิดข้อผิดพลาดในการตรวจสอบความชิ้นในเครื่องปลูก');
    }
    if (req.session.temperatureCheckStatus == 500 || req.session.soilMoistureCheckStatus == 500) {
      res.json({
        status: 500,
        errorMessage: messageArray
      });
    }
  } else if (checkType == "project") {
    if (req.session.fertilityCheckStatus == 500) {
      messageArray.push('เกิดข้อผิดพลาดในการตรวจสอบความอุดมสมบูรณ์ในเครื่องปลูก');
    }
    if (req.session.fertilityCheckStatus == 500) {
      res.json({
        status: 500,
        errorMessage: messageArray
      });
    }
  }
}

module.exports = router;