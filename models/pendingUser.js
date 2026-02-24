import mongoose from "mongoose";
import bcrypt from "bcrypt";

const pendingUserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  fullname: { type: String, required: true },
  password: { type: String, required: true },
  telegramUsername: { type: String, required: true },

  telegramChatId: { type: String, default: null },
  telegramLinkedAt: { type: Date },

  expiresAt: { type: Date, required: true },
});

pendingUserSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

pendingUserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

export default mongoose.model("PendingUser", pendingUserSchema);
