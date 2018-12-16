import FertilizerConfig from "../classes/FertilizerControl/FertilizerConfig";
import ManualFertilizer from "../classes/FertilizerControl/ManualFertilizer";
import ShowFertilizerConfig from "../classes/FertilizerControl/ShowFertilizerConfig";

const express = require("express");
const router = express.Router();

router.use("/fertilizerConfig", (req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", origin_url);
    res.setHeader(
        "Access-Control-Allow-Headers",
        "X-Requested-With,content-type"
    );
    res.set("Content-Type", "application/json");
    next();
});

router.post("/fertilizerConfig", (req, res) => {
    new FertilizerConfig(req, res);
});

router.use("/manualFertilizer", (req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", origin_url);
    res.setHeader(
        "Access-Control-Allow-Headers",
        "X-Requested-With,content-type"
    );
    res.set("Content-Type", "application/json");
    next();
});

router.post("/manualFertilizer", (req, res) => {
    new ManualFertilizer(req, res);
});

router.use("/showFertilizerConfig", (req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", origin_url);
    res.setHeader(
        "Access-Control-Allow-Headers",
        "X-Requested-With,content-type"
    );
    res.set("Content-Type", "application/json");
    next();
});

router.post("/showFertilizerConfig", (req, res) => {
    new ShowFertilizerConfig(req, res);
})

module.exports = router;