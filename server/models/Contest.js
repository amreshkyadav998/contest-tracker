import mongoose from "mongoose";

const ContestSchema = new mongoose.Schema(
  {
    contest_name: { type: String, required: true },
    start_time: { type: Date, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Contest", ContestSchema);
