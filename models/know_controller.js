const mongoose = require("mongoose");

const {Schema} = mongoose;

const know_controllerSchema = new Schema({
    knowControllerId: Number,
    ip: String,
    mac_address: String,
    name: String,
    projectId: Number,
    greenHouseId: Number,
    farmId: Number,
});

mongoose.model("know_controller",know_controllerSchema);