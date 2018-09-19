const mongoose = require("mongoose");
const autoIncrement = require("mongoose-sequence")(mongoose);

const {
    Schema
} = mongoose;

const growthRateSchema = new Schema({
    farmId:Number,
    greenHouseId: Number,
    projectId: Number,
    count: Number,
    trunkDiameter: Number,
    leafWidth: Number,
    totalLeaf: Number,
    height: Number,
    description: String,
    timeStamp: Date,
    picturePath: String
});

growthRateSchema.plugin(autoIncrement, {
    inc_field: "growthRateId"
});
mongoose.model("growth_rate", growthRateSchema, "growth_rate");