const mongoose = require("mongoose");
const autoIncrement = require("mongoose-sequence")(mongoose);

const {
    Schema
} = mongoose;

const waterHistorySchema = new Schema({
    farmId: Number,
    greenHouseId: Number,
    history: [{
        volume: Number,
        startTime: Date
    }]
});

waterHistorySchema.plugin(autoIncrement, {inc_field: "waterHistoryId"});
mongoose.model("water_history", waterHistorySchema, "water_history");