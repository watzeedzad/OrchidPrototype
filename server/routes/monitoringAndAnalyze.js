import ShowWateringHistory from "../classes/MonitoringAndAnalyze/ShowWateringHistory";
import ShowFertilizerHistory from "../classes/MonitoringAndAnalyze/ShowFertilizerHistory";
import AddGrowthRate from "../classes/MonitoringAndAnalyze/AddGrowthRate";
import LoadGrowthRateCSV from "../classes/MonitoringAndAnalyze/LoadGrowthRateCSV";
import LoadCompareGrowthRate from '../classes/MonitoringAndAnalyze/LoadCompareGrowthRate'
import GetCompareProject from '../classes/MonitoringAndAnalyze/GetCompareProject'


const express = require("express");
const router = express.Router();

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

router.use("/loadCompareGrowthRate", (req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", origin_url);
    res.setHeader(
        "Access-Control-Allow-Headers",
        "X-Requested-With,content-type"
    );
    res.set("Content-Type", "application/json");
    next();
});

router.post("/loadCompareGrowthRate", (req, res) => {
    new LoadCompareGrowthRate(req, res);
});

router.use("/getCompareProject", (req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", origin_url);
    res.setHeader(
        "Access-Control-Allow-Headers",
        "X-Requested-With,content-type"
    );
    res.set("Content-Type", "application/json");
    next();
});

router.post("/getCompareProject", (req, res) => {
    new GetCompareProject(req, res);
});

module.exports = router;