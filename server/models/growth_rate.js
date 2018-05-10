const mongoose = require("mongoose");
const autoIncrement = require("mongoose-sequence")(mongoose);

const {
    Schema
} = mongoose;

const growthRateSchema = new Schema({
    projectId: Number,
    expectedRate: [{
        beginHeight: Number,
        endHeight: Number,
        beginTimeStamp: Date,
        endTimeStamp: Date
    }],
    accualRate: [{
        height: Number,
        description: String,
        timeStamp: Date,
        picturePath: String
    }]
});

growthRateSchema.plugin(autoIncrement, {
    inc_field: "growthRateId"
});
mongoose.model("growth_rate", growthRateSchema);