import ShowSoilMoisture from "../classes/PlanterAnalyze/ShowSoilMoisture";
import ConfigSoilMoisture from "../classes/PlanterAnalyze/ConfigSoilMoisture";
import ShowFertility from "../classes/PlanterAnalyze/ShowFertility";
import ConfigFertility from "../classes/PlanterAnalyze/ConfigFertility";
import ShowAllFertility from "../classes/PlanterAnalyze/ShowAllFertility";

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
  new ShowAllFertility(req, res);
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