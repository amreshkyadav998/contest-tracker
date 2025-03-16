import mongoose from "mongoose";

const contestSchema = new mongoose.Schema({
  contest_code: String,
  contest_name: String,
  contest_start_date: String,
  contest_end_date: String,
  contest_start_date_iso: String,
  contest_end_date_iso: String,
  contest_duration: String,
  distinct_users: Number,
});

export default mongoose.model("Contest", contestSchema);
