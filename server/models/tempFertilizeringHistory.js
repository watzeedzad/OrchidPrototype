const mongoose = require("mongoose");
const autoIncrement = require("mongoose-sequence")(mongoose);

const {
    Schema
} = mongoose;

const tempFertilizeringHistorySchema = new Schema({
    farmId: Number,
    projectId: Number,
    amount: Number,
    timeStamp: Date
});

tempFertilizeringHistorySchema.plugin(autoIncrement, {
    inc_field: "tempAutoFertilizeringId"
});
mongoose.model("temp_fertilizering_history", tempFertilizeringHistorySchema, "temp_fertilizering_history");