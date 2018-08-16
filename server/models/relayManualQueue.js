const mongoose = require("mongoose");
const autoIncrement = require("mongoose-sequence")(mongoose);

const {
    Schema
} = mongoose;

const relayManualQueueSchema = new Schema({
    pumpType: String,
    ip: String,
    inputLitre: String,
    macAddress: String
});

relayManualQueueSchema.plugin(autoIncrement, {
    inc_field: "manualQueueId"
});
mongoose.model("relay_manual_queue", relayManualQueueSchema, "relay_manual_queue");