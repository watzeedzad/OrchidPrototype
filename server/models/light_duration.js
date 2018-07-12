const mongoose = require("mongoose");
const autoIncrement = require("mongoose-sequence")(mongoose);

const { Schema } = mongoose;

const lightDurationSchema = new Schema({
  greenHouseId: Number,
  farmId: Number,
  duration: Number
});

lightDurationSchema.plugin(autoIncrement, {
  inc_field: "lightDurationId"
});
mongoose.model("light_duration", lightDurationSchema);
