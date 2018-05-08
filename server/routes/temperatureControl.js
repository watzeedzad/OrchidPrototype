import ConfigTemperature from "../classes/TemperatureControl/ConfigTemperature";
import ShowTemprature from "../classes/TemperatureControl/ShowTemperature";
import ConfigHumidity from "../classes/TemperatureControl/ConfigHumidity";
import ShowHumidity from "../classes/TemperatureControl/ShowHumidity";
import ShowTemperatureHistory from "../classes/TemperatureControl/ShowTemperatureHistory";
import ShowHumidityHistory from "../classes/TemperatureControl/ShowHumidityHistory";

const express = require("express");
const router = express.Router();

router.use("/configTemperature", (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", origin_url);
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  res.set("Content-Type", "application/json");
  next();
});

router.post("/configTemperature", (req, res) => {
  new ConfigTemperature(req, res);
});

router.use("/configHumidity", (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", origin_url);
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  res.set("Content-Type", "application/json");
  next();
});

router.post("/configHumidity", (req, res) => {
  new ConfigHumidity(req, res);
});

router.use("/showTemperature", (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", origin_url);
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  res.set("Content-Type", "application/json");
  next();
});

router.post("/showTemperature", (req, res) => {
  new ShowTemprature(req, res);
});

router.use("/showHumidity", (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", origin_url);
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  res.set("Content-Type", "application/json");
  next();
});

router.post("/showHumidity", (req, res) => {
  new ShowHumidity(req, res);
});

router.use("/showTemperatureHistory", (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", origin_url);
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  res.set("Content-Type", "application/json");
  next();
});

router.post("/showTemperatureHistory", (req, res) => {
  new ShowTemperatureHistory(req, res);
});

router.use("/showHumidityHistory", (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  res.set("Content-Type", "application/json");
  next();
});

router.post("/showHumidityHistory", (req, res) => {
  new ShowHumidityHistory(req, res);
});

module.exports = router;