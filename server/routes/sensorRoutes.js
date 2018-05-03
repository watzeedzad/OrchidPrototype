const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
import TemperatureCheck from "../classes/TemperatureCheck";
import GreenHouseSensor from "../classes/SaveData/GreenHouseSensor";
import ProjectSensor from "../classes/SaveData/ProjectSensor";

//Add greenHouseSensor
router.post("/greenHouseSensor", (req, res) => {
  new GreenHouseSensor(req, res);
  new TemperatureCheck(req, res);
});

//Add projectSensor
router.post("/projectSensor", (req, res) => {
  new ProjectSensor(req, res);
  res.sendStatus(200);
});

module.exports = router;