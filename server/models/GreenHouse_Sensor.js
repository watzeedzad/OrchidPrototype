const mongoose = require("mongoose");
const autoIncrement = require("mongoose-sequence")(mongoose);

const {
  Schema
} = mongoose;

const greenHouse_SensorSchema = new Schema({
  temperature: Number,
  humidity: Number,
  soilMoisture: Number,
  ambientLight: Number,
  timeStamp: Date,
  greenHouseId: Number,
  farmId: Number
});

greenHouse_SensorSchema.plugin(autoIncrement, {
  inc_field: "greenHouseSensorId"
});
mongoose.model("greenHouse_Sensor", greenHouse_SensorSchema, "greenhouse_sensor");