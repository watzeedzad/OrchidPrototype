const mongoose = require("mongoose");
const autoIncrement = require("mongoose-sequence")(mongoose);

const {
  Schema
} = mongoose;

const farmSchema = new Schema({
  farmName: String,
  ownerName: String,
  ownerSurname: String,
  ownerTel: String,
  ownerAddress: String,
  configFilePath: String
});

farmSchema.plugin(autoIncrement, {
  inc_field: "farmId"
});
mongoose.model("farm", farmSchema);