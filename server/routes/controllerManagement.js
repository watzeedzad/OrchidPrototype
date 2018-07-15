import CreateController from "../classes/ControllerManagement/CreateController";

const express = require("express");
const router = express.Router();

router.use("/createController", (req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", origin_url);
    res.setHeader(
        "Access-Control-Allow-Headers",
        "X-Requested-With,content-type"
    );
    res.set("Content-Type", "application/json");
    next();
});

router.get("/createController", (req, res) => {
    new CreateController(req, res);
});

module.exports = router;