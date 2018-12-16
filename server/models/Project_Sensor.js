const mongoose = require("mongoose");
const autoIncrement = require("mongoose-sequence")(mongoose);

const {
  Schema
} = mongoose;

const project_SensorSchema = new Schema({
  soilFertility: Number,
  timeStamp: Date,
  projectId: Number,
  greenHouseId: Number,
  farmId: Number
});

project_SensorSchema.plugin(autoIncrement, {
  inc_field: "projectSensorId"
});
mongoose.model("project_Sensor", project_SensorSchema, "project_sensor");