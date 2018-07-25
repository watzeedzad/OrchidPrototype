import ShowGrowthRateGraph from "../classes/MonitoringAndAnalyze/ShowGrowthRateGraph";
import ShowSpecificGrowthRateGraph from "../classes/MonitoringAndAnalyze/ShowSpecificGrowthRateGraph";
import ShowWateringHistory from "../classes/MonitoringAndAnalyze/ShowWateringHistory";
import ShowFertilizerHistory from "../classes/MonitoringAndAnalyze/ShowFertilizerHistory";


const express = require("express");
const router = express.Router();

router.use("/showGrowthRateGraph", (req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", origin_url);
    res.setHeader(
        "Access-Control-Allow-Headers",
        "X-Requested-With,content-type"
    );
    res.set("Content-Type", "application/json");
    next();
});

router.post("/showGrowthRateGraph", (req, res) => {
    new ShowGrowthRateGraph(req, res);
});

router.use("/showSpecificGrowthRateGraph", (req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", origin_url);
    res.setHeader(
        "Access-Control-Allow-Headers",
        "X-Requested-With,content-type"
    );
    res.set("Content-Type", "application/json");
    next();
});

router.post("/showSpecificGrowthRateGraph", (req, res) => {
    new ShowSpecificGrowthRateGraph(req, res);
});

router.use("/wateringHistory", (req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", origin_url);
    res.setHeader(
        "Access-Control-Allow-Headers",
        "X-Requested-With,content-type"
    );
    res.set("Content-Type", "application/json");
    next();
});

router.post("/wateringHistory", (req, res) => {
    new ShowWateringHistory(req, res);
});

router.use("/fertilizerHistory", (req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", origin_url);
    res.setHeader(
        "Access-Control-Allow-Headers",
        "X-Requested-With,content-type"
    );
    res.set("Content-Type", "application/json");
    next();
});

router.post("/fertilizerHistory", (req, res) => {
    new ShowFertilizerHistory(req, res);
});

module.exports = router;