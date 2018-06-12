import ManualWater from "../classes/WaterControl/ManualWater";
import ShowWateringConfig from "../classes/WaterControl/ShowWateringConfig";
import WateringConfig from "../classes/WaterControl/WateringConfig";

const express = require("express");
const router = express.Router();

router.use("/manualWatering", (req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", origin_url);
    res.setHeader(
        "Access-Control-Allow-Headers",
        "X-Requested-With,content-type"
    );
    res.set("Content-Type", "application/json");
    next();
});

router.post("/manualWatering", (req, res) => {
    new ManualWater(req, res);
});

router.use("/showWateringConfig", (req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", origin_url);
    res.setHeader(
        "Access-Control-Allow-Headers",
        "X-Requested-With,content-type"
    );
    res.set("Content-Type", "application/json");
    next();
});

router.post("/showWateringConfig", (req, res) => {
    new ShowWateringConfig(req, res);
});

router.use("/wateringConfig", (req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", origin_url);
    res.setHeader(
        "Access-Control-Allow-Headers",
        "X-Requested-With,content-type"
    );
    res.set("Content-Type", "application/json");
    next();
});

router.post("/wateringConfig", (req, res) => {
    new WateringConfig(req, res);
});

module.exports = router;