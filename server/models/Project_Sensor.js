const mongoose = require("mongoose");

const { Schema } = mongoose;

const project_SensorSchema = new Schema({
  projectSensorId: Number,
  soilFertilizer: Number,
  timeStamp: Date,
  projectId: Number
});

mongoose.model("project_Sensor", project_SensorSchema);