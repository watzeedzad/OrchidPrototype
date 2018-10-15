const express = require("express");
const router = express.Router();
const syncNode = require("sync-node");
const jobQueue = syncNode.createQueue();
import GreenHouseSensor from "../classes/SaveData/GreenHouseSensor";
import ProjectSensor from "../classes/SaveData/ProjectSensor";
import TemperatureCheck from "../classes/CheckFunction/TemperatureCheck";
import SoilMoistureCheck from "../classes/CheckFunction/SoilMoistureCheck";
import FertilityCheck from "../classes/CheckFunction/FertilityCheck";
// import LightCheck from "../classes/CheckFunction/LightCheck";

let status = 0;

//Add greenHouseSensor
router.post("/greenHouseSensor", (req, res) => {
  req.session.temperatureCheckStatus = 0;
  req.session.soilMoistureCheckStatus = 0;
  req.session.lightCheckStatus = 0;
  new GreenHouseSensor(req);
  new TemperatureCheck(req);
  new SoilMoistureCheck(req);
  new LightCheck(req, res);
  setTimeout(() => {
    if (req.session.temperatureCheckStatus == 200 && req.session.soilMoistureCheckStatus == 200 && req.session.lightCheckStatus == 200) {
      res.sendStatus(200);
    } else {
      checkStatus(req, res, "greenHouse");
    }
  }, 4500);
  // new GreenHouseSensor(req, res);
  // new TemperatureCheck(req, res);
  // new SoilMoistureCheck(req, res);
  // if (req.session.temperatureCheckStatus == 200 && req.session.soilMoistureCheckStatus == 200) {
  //   res.sendStatus(200);
  // } else {
  //   checkStatus(req, res, "greenHouse");
  // }
});

//Add projectSensor
router.post("/projectSensor", (req, res) => {
  req.session.fertilityCheckStatus = 0;
  new ProjectSensor(req, res);
  new FertilityCheck(req, res);
  setTimeout(() => {
    if (req.session.fertilityCheckStatus == 200) {
      res.sendStatus(200);
    } else {
      checkStatus(req, res, "project");
    }
  }, 3500);
});

function checkStatus(req, res, checkType) {
  console.log("start check status " + checkType);
  let messageArray = [];
  if (checkType == "greenHouse") {
    if (req.session.temperatureCheckStatus == 500) {
      messageArray.push('เกิดข้อผิดพลาดในการตรวจสอบอุณหภูมิ');
    }
    if (req.session.soilMoistureCheckStatus == 500) {
      messageArray.push('เกิดข้อผิดพลาดในการตรวจสอบความชิ้นในเครื่องปลูก');
    }
    if (req.session.lightCheckStatus == 500) {
      messageArray.push('เกิดข้อผิดพลาดในการตรวจสอบความเข้มแสง');
    }
    if (req.session.temperatureCheckStatus == 500 || req.session.soilMoistureCheckStatus == 500 || req.session.lightCheckStatus == 500) {
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