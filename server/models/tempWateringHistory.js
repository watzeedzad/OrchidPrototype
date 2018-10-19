const mongoose = require("mongoose");
const autoIncrement = require("mongoose-sequence")(mongoose);

const {
    Schema
} = mongoose;

const tempWateringHistorySchema = new Schema({
    farmId: Number,
    greenHouseId: Number,
    amount: Number,
    timeStamp: Date
});

tempWateringHistorySchema.plugin(autoIncrement, {
    inc_field: "tempAutoWateringHistoryId"
});
mongoose.model("temp_watering_history", tempWateringHistorySchema, "temp_watering_history");