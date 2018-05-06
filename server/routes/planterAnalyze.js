import ShowSoilMoisture from "../classes/PlanterAnalyze/ShowSoilMoisture";
import ConfigSoilMoisture from "../classes/PlanterAnalyze/ConfigSoilMoisture";
import ShowFertility from "../classes/PlanterAnalyze/ShowFertility";
import ConfigFertility from "../classes/PlanterAnalyze/ConfigFertility";
import ShowAllFertility from "../classes/PlanterAnalyze/ShowAllFertility";
import ShowFertilityHistory from "../classes/PlanterAnalyze/ShowFertilityHistory";
import ShowSoilMoistureHistory from "../classes/PlanterAnalyze/ShowSoilMoistureHistory";

const express = require("express");
const router = express.Router();

router.use("/configFertility", (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", origin_url);
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
  res.setHeader("Access-Control-Allow-Origin", origin_url);
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
  res.setHeader("Access-Control-Allow-Origin", origin_url);
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
  res.setHeader("Access-Control-Allow-Origin", origin_url);
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
  res.setHeader("Access-Control-Allow-Origin", origin_url);
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  res.set("Content-Type", "application/json");
  next();
});

router.post("/showSoilMoisture", (req, res) => {
  new ShowSoilMoisture(req, res);
});

router.use("showFertilityHistory", (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", origin_url);
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  res.set("Content-Type", "application/json");
  next();
});

router.post("/showFertilityHistory", (req, res) => {
  new ShowFertilityHistory(req, res);
});

router.use("/showSoilMoistureHistory", (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", origin_url);
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  res.set("Content-Type", "application/json");
  next();
})

router.post("/showSoilMoistureHistory", (req, res) => {
  new ShowSoilMoistureHistory(req, res);
})

module.exports = router;