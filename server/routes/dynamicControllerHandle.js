import DynamicControllerHandle from "../classes/DynamicControllerHandle/Handler";

const express = require("express");
const router = express.Router();

router.post("/", (req, res) => {
    new DynamicControllerHandle(req, res);
});

module.exports = router;