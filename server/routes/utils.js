import CheckAvailablePump from "../classes/Utils/CheckAvailablePump";

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

module.exports = router;