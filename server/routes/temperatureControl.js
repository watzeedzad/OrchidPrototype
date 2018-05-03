import ConfigTemperature from "../classes/ConfigTemperature";
import ShowTemprature from "../classes/ShowTemperature";
import ConfigHumidity from "../classes/ConfigHumidity";
import ShowHumidity from "../classes/ShowHumidity";

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

module.exports = router;