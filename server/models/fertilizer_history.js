const mongoose = require("mongoose");
const autoIncrement = require("mongoose-sequence")(mongoose);

const {
    Schema
} = mongoose;

const fertilizerHistorySchema = new Schema({
    projectId: Number,
    history: [{
        volume: Number,
        ration: String,
        timeStamp: Date
    }]
});

fertilizerHistorySchema.plugin(autoIncrement, {
    inc_field: "fertilizerHistoryId"
});
mongoose.model("fertilizer_history", fertilizerHistorySchema, "fertilizer_history");