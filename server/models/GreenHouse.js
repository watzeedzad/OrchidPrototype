const mongoose = require("mongoose");
const autoIncrement = require("mongoose-sequence")(mongoose);

const {
    Schema
} = mongoose;

const greenHouseSchema = new Schema({
    farmId: Number,
    name: String,
    desc: String,
    picturePath: String
});

greenHouseSchema.plugin(autoIncrement, {
    inc_field: "greenhouseId"
});
mongoose.model("greenHouse", greenHouseSchema);