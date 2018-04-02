const mongoose = require("mongoose");

const { Schema } = mongoose;

const farmSchema = new Schema({
  farmId: Number,
  farmName: String,
  ownerName: String,
  ownerSurname: String,
  ownerTel: String,
  ownerAddress: String,
  configFilePath: String
});

mongoose.model("farm", farmSchema);
