import Otp from "../models/otp.js";
import bcrypt from "bcrypt";
import bot from "./telegramBot.js";

export const generateAndSendOtp = async (pendingUser) => {
  if (!pendingUser.telegramChatId) {
    throw new Error("Telegram not connected");
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  const hashedOtp = await bcrypt.hash(otp, 10);

  await Otp.deleteMany({ userId: pendingUser._id });

  await Otp.create({
    userId: pendingUser._id,
    hashedOtp,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000),
  });

  await bot.api.sendMessage(
    pendingUser.telegramChatId,
    `🔐 OTP: ${otp}\nValid for 5 minutes.`,
  );
};
