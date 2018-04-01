const mongoose = require("mongoose");

const { Schema } = mongoose;

const farmSchema = new Schema({
  famrId: Number,
  farmName: String,
  ownerName: String,
  ownerSurname: String,
  ownerTel: String,
  owneraddress: String,
  configFilePath: String
});

mongoose.model("farm", farmSchema);
