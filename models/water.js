import mongoose from "mongoose";

const waterSchema = new mongoose.Schema({
  weather: Number,
  sports: Number,
  date: Date,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
});

const Water = mongoose.model("water", waterSchema);

export default Water;
