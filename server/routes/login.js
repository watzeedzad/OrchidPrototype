import Login from "../classes/Utils/Login";

const express = require("express");
const router = express.Router();

router.use("/", (req, res, next) => {
    console.log(origin_url);
    res.setHeader("Access-Control-Allow-Origin", origin_url);
    res.setHeader(
        "Access-Control-Allow-Headers",
        "X-Requested-With,content-type"
    );
    res.set("Content-Type", "application/json");
    next();
});

router.post("/", (req, res) => {
    new Login(req, res);
});

module.exports = router;