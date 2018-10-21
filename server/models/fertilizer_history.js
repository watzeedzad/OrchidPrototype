const mongoose = require("mongoose");
const autoIncrement = require("mongoose-sequence")(mongoose);

const {
    Schema
} = mongoose;

const fertilizerHistorySchema = new Schema({
    farmId: Number,
    greenHouseId: Number,
    projectId: Number,
    history: [{
        volume: Number,
        ratio: String,
        startTime: Date
    }]
});

fertilizerHistorySchema.plugin(autoIncrement, {
    inc_field: "fertilizerHistoryId"
});
mongoose.model("fertilizer_history", fertilizerHistorySchema, "fertilizer_history");