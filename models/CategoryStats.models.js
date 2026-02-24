import mongoose from "mongoose";

const categoryStatsSchema = new mongoose.Schema({
  category: {
    type: String,
    unique: true,
    index: true,
  },

  totalItems: {
    type: Number,
    required: true,
  },
});

export default mongoose.model("CategoryStats", categoryStatsSchema);
