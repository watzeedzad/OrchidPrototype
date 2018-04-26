const mongoose = require("mongoose");

const { Schema } = mongoose;

const userSchema = new Schema({
  userId: Number,
  farmId: Number,
  role: String,
  username: String,
  password: String
});

mongoose.model("user", userSchema);