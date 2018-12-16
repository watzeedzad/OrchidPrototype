const mongoose = require("mongoose");
const autoIncrement = require("mongoose-sequence")(mongoose);

const { Schema } = mongoose;

const lightDurationSchema = new Schema({
  farmId: Number,
  greenHouseId: Number,
  duration: Number,
  timeStamp: Date
});

lightDurationSchema.plugin(autoIncrement, {
  inc_field: "lightDurationId"
});
mongoose.model("light_duration", lightDurationSchema, "light_duration");
