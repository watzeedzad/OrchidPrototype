const mongoose = require("mongoose");
const autoIncrement = require("mongoose-sequence")(mongoose);

const {
    Schema
} = mongoose;

const greenHouseSchema = new Schema({
    farmId: Number,
    greenHouseId: Number,
    name: String,
    desc: String,
    picturePath: String,
    isAutoWatering: Boolean
});

greenHouseSchema.plugin(autoIncrement, {
    inc_field: "greenHouseId"
});
mongoose.model("greenHouse", greenHouseSchema, "greenhouse");