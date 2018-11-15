import CheckAvailablePump from "../classes/Utils/CheckAvailablePump";
import IsAutoWatering from "../classes/Utils/IsAutoWatering";
import IsAutoFertilizering from "../classes/Utils/IsAutoFertilizering";

const express = require("express");
const router = express.Router();

router.use("/checkAvailable", (req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", origin_url);
    res.setHeader(
        "Access-Control-Allow-Headers",
        "X-Requested-With,content-type"
    );
    res.set("Content-Type", "application/json");
    next();
});

router.post("/checkAvailable", (req, res) => {
    new CheckAvailablePump(req, res);
});

router.use("/isAutoWatering", (req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", origin_url);
    res.setHeader(
        "Access-Control-Allow-Headers",
        "X-Requested-With,content-type"
    );
    res.set("Content-Type", "application/json");
    next();
});

router.post("/isAutoWatering", (req, res) => {
    new IsAutoWatering(req, res);
});

router.use("/isAutoFertilizering", (req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", origin_url);
    res.setHeader(
        "Access-Control-Allow-Headers",
        "X-Requested-With,content-type"
    );
    res.set("Content-Type", "application/json");
    next();
});

router.post("/isAutoFertilizering", (req, res) => {
    new IsAutoFertilizering(req, res);
});

module.exports = router;