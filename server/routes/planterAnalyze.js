import ShowSoilMoisture from "../classes/ShowSoilMoisture";
import ConfigSoilMoisture from "../classes/ConfigSoilMoisture";
import ShowFertility from "../classes/ShowFertility";
import ConfigFertility from "../classes/ConfigFertility";

const express = require("express");
const router = express.Router();

router.use("/configFertility", (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  res.set("Content-Type", "application/json");
  next();
});

router.post("/configFertility", (req, res) => {
  new ConfigFertility(req, res);
});

router.use("/configSoilMoisture", (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  res.set("Content-Type", "application/json");
  next();
});

router.post("/configSoilMoisture", (req, res) => {
  new ConfigSoilMoisture(req, res);
});

router.use("/showFertility", (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  res.set("Content-Type", "application/json");
  next();
});

router.post("/showFertility", (req, res) => {
  new ShowFertility(req, res);
});

router.use("/showAllFertility", (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  res.set("Content-Type", "application/json");
  next();
})

router.post("/showAllFertility", (req, res) => {
  
})

router.use("/showSoilMoisture", (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  res.set("Content-Type", "application/json");
  next();
});

router.post("/showSoilMoisture", (req, res, next) => {
  new ShowSoilMoisture(req, res);
});

module.exports = router;