const mongoose = require("mongoose");

const {Schema} = mongoose;

const greenHouseSchema = new Schema({
    greemHouseId : Number,
    farmId : Number,
    name : String,
    desc : String,
    picturePath : String
});

mongoose.model("greenHouse",greenHouseSchema);