const mongoose = require("mongoose");
const autoIncrement = require("mongoose-sequence")(mongoose);

const {
    Schema
} = mongoose;

const projectSchema = new Schema({
    farmId: Number,
    greenHouseId: Number,
    name: String,
    tribeName: String,
    picturePath: String,
    isAutoFertilizering: Boolean,
    currentRatio: String
});

projectSchema.plugin(autoIncrement, {
    inc_field: "projectId"
});
mongoose.model("project", projectSchema, "project");