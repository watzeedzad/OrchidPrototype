const mongoose = require("mongoose");
const autoIncrement = require("mongoose-sequence")(mongoose);

const {
    Schema
} = mongoose;

const waterHistorySchema = new Schema({
    greenHouseId: Number,
    history: [{
        volume: Number,
        timeStamp: Date
    }]
});

waterHistorySchema.plugin(autoIncrement, {inc_field: "waterHistoryId"});
mongoose.model("water_history", waterHistorySchema);