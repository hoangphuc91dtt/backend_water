import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  gender: String,
  weight: Number,
  wakupTime: String,
  bedTime: String
});

const User = mongoose.model("user", userSchema);

export default User;
