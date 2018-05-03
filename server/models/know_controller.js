const mongoose = require("mongoose");
const autoIncrement = require("mongoose-sequence")(mongoose);

const {Schema} = mongoose;

const know_controllerSchema = new Schema({
    ip: String,
    mac_address: String,
    name: String,
    projectId: Number,
    greenHouseId: Number,
    farmId: Number,
});

know_controllerSchema.plugin(autoIncrement, {inc_field: "knowControllerId"});
mongoose.model("know_controller",know_controllerSchema);