const mongoose = require("mongoose");

const { Schema } = mongoose;

const greenHouse_SensorSchema = new Schema({
  greenHouseSensorId: Number,
  temperature: Number,
  humidity: Number,
  soilMoisture: Number,
  ambientLight: Number,
  timeStamp: Date,
  greenHouseId: Number
});

mongoose.model("greenHouse_Sensor", greenHouse_SensorSchema);
