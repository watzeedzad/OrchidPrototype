const mongoose = require("mongoose");
const autoIncrement = require("mongoose-sequence")(mongoose);

const {
  Schema
} = mongoose;

const userSchema = new Schema({
  farmId: Number,
  role: String,
  firstname: String,
  lastname: String,
  username: String,
  password: String
});

userSchema.plugin(autoIncrement, {
  inc_field: "userId"
});
mongoose.model("user", userSchema, "user");