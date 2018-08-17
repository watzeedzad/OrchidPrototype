import ShowLightVolume from "../classes/LightingControl/ShowLightVolume";
import ShowLightIntensity from "../classes/LightingControl/ShowLightIntensity";
import LightVolumeConfig from "../classes/LightingControl/LightVolumeConfig";
import LightIntensityConfig from "../classes/LightingControl/LightIntensityConfig";

const express = require("express");
const router = express.Router();

router.use("/showLightVolume", (req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", origin_url);
    res.setHeader(
        "Access-Control-Allow-Headers",
        "X-Requested-With,content-type"
    );
    res.set("Content-Type", "application/json");
    next();
});

router.post("/showLightVolume", (req, res) => {
    new ShowLightVolume(req, res);
});

router.use("/showLightIntensity", (req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", origin_url);
    res.setHeader(
        "Access-Control-Allow-Headers",
        "X-Requested-With,content-type"
    );
    res.set("Content-Type", "application/json");
    next();
});

router.post("/showLightIntensity", (req, res) => {
    new ShowLightIntensity(req, res);
});

router.use("/lightIntensityConfig", (req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", origin_url);
    res.setHeader(
        "Access-Control-Allow-Headers",
        "X-Requested-With,content-type"
    );
    res.set("Content-Type", "application/json");
    next();
});

router.post("/lightIntensityConfig", (req, res) => {
    new LightIntensityConfig(req, res);
});

router.use("/lightVolumeConfig", (req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", origin_url);
    res.setHeader(
        "Access-Control-Allow-Headers",
        "X-Requested-With,content-type"
    );
    res.set("Content-Type", "application/json");
    next();
});

router.post("/lightVolumeConfig", (req, res) => {
    new LightVolumeConfig(req, res);
});