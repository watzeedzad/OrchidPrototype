import ShowGrowthRateGraph from "../classes/MonitoringAndAnalyze/ShowGrowthRateGraph";
import ShowSpecificGrowthRateGraph from "../classes/MonitoringAndAnalyze/ShowSpecificGrowthRateGraph";
import ShowWateringHistory from "../classes/MonitoringAndAnalyze/ShowWateringHistory";
import ShowFertilizerHistory from "../classes/MonitoringAndAnalyze/ShowFertilizerHistory";
import AddGrowthRate from "../classes/MonitoringAndAnalyze/AddGrowthRate";
import LoadGrowthRateCSV from "../classes/MonitoringAndAnalyze/LoadGrowthRateCSV";


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

router.use("/addGrowthRate", (req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", origin_url);
    res.setHeader(
        "Access-Control-Allow-Headers",
        "X-Requested-With,content-type"
    );
    res.set("Content-Type", "application/json");
    next();
});

router.post("/addGrowthRate", (req, res) => {
    new AddGrowthRate(req, res);
});

router.use("/loadGrowthRateCSV", (req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", origin_url);
    res.setHeader(
        "Access-Control-Allow-Headers",
        "X-Requested-With,content-type"
    );
    res.set("Content-Type", "application/json");
    next();
});

router.post("/loadGrowthRateCSV", (req, res) => {
    new LoadGrowthRateCSV(req, res);
});

module.exports = router;