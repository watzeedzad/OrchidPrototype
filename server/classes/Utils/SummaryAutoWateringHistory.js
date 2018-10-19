const mongoose = require("mongoose");
const tempAutoWateringHistory = mongoose.model("temp_watering_history");

export default class SummaryAutoWateringHistory {
    constructor() {
        operation();
    }
}

async function operation() {
    
}