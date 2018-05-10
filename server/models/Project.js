const mongoose = require("mongoose");
const autoIncrement = require("mongoose-sequence")(mongoose);

const {
    Schema
} = mongoose;

const projectSchema = new Schema({
    greenHouseId: Number,
    tribeName: String,
    picturePath: String
});

projectSchema.plugin(autoIncrement, {
    inc_field: "projectId"
});
mongoose.model("project", projectSchema);