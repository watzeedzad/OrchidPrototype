import ManualWater from "../classes/WaterControl/ManualWater";

const express = require("express");
const router = express.Router();

router.use("/manualWater", (req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", origin_url);
    res.setHeader(
        "Access-Control-Allow-Headers",
        "X-Requested-With,content-type"
    );
    res.set("Content-Type", "application/json");
    next();
});

router.post("/manualWater", (req, res) => {
    new ManualWater(req, res);
});

module.exports = router;