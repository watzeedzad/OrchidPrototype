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
    req.session.destroy(function (err) {
        if (err) {
            console.log("[Logout] destroy session fail");
            res.sendStatus(500);
        } else {
            console.log("[Logout] destroy session successful");
            res.sendStatus(200);
        }
    });
});

module.exports = router;