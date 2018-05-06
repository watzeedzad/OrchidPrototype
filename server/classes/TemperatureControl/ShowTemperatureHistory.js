const fs = require("fs");
const mongoose = require("mongoose");
const greenHouseSensor = mongoose.model("greenHouse_Sensor");

export default class ShowTemperatureHistory {
    constructor(req, res) {
        this.process(req, res);
    }

    async process(req, res) {
        
    }
}