const mongoose = require("mongoose");
const autoIncrement = require("mongoose-sequence")(mongoose);

const {
    Schema
} = mongoose;

const relayQueueSchema = new Schema({
    pumpType: String,
    ip: String,
    command: Boolean,
    macAddress: String
});

relayQueueSchema.plugin(autoIncrement, {
    inc_field: "queueId"
});
mongoose.model("relay_queue", relayQueueSchema, "relay_queue");