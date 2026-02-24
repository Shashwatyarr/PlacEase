import mongoose from "mongoose";

const Otp = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  hashedOtp: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});

Otp.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model("otp", Otp);
