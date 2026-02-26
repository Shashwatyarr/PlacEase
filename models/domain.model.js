import mongoose from "mongoose";

const domainSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    icon: String,
    description: String,
    weight: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Domain", domainSchema);
