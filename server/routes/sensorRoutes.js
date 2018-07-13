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
  async function doThis() {
    new GreenHouseSensor(req, res);
    await new TemperatureCheck(req, res);
    await new SoilMoistureCheck(req, res);
    await checkStatus(res);
    if (temperatureCheckStatus == 200 && soilMoistureCheckStatus == 200) {
      res.sendStatus(200);
    }
  }
  doThis();
});

//Add projectSensor
router.post("/projectSensor", (req, res) => {
  new ProjectSensor(req, res);
  new FertilityCheck(req, res);
  res.sendStatus(200);
});

function checkStatus(res) {
  console.log("start check status");
  let messageArray = [];
  if (temperatureCheckStatus == 500) {
    messageArray.push('เกิดข้อผิดพลาดในการตรวจสอบอุณหภูมิ');
  }
  if (soilMoistureCheckStatus == 500) {
    messageArray.push('เกิดข้อผิดพลาดในการตรวจสอบความชิ้นในเครื่องปลูก');
  }
  if (fertilityCheckStatus == 500) {
    messageArray.push('เกิดข้อผิดพลาดในการตรวจสอบความอุดมสมบูรณ์ในเครื่องปลูก');
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