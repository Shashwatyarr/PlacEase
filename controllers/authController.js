import User from "../models/User.js";
import Otp from "../models/Otp.js";
import PendingUser from "../models/pendingUser.js";
import bcrypt from "bcrypt";
import bot from "../utils/send_telegram.js";
import jwt from "jsonwebtoken";

// ───── SIGNUP ─────
export const signup = async (req, res) => {
  const { username, fullname, password, telegramUsername } = req.body;

  const existing = await User.findOne({ username });
  if (existing) {
    return res.status(400).json({ message: "User already exists" });
  }

  await PendingUser.deleteMany({ username });

  const pending = await PendingUser.create({
    username,
    fullname,
    password,
    telegramUsername,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000),
  });

  res.json({
    message: "Signup initiated. Connect Telegram.",
    telegramLink: `https://t.me/PlacEaze_OTP_bot?start=${pending._id}`,
  });
};

// ───── LOGIN STEP 1 ─────
export const login = async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  const isValid = await user.matchPassword(password);
  if (!isValid) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  if (!user.telegram?.chatId) {
    return res.status(400).json({
      message: "Telegram not linked. Please reconnect.",
    });
  }

  res.json({
    success: true,
    message: "Password correct. Request OTP.",
  });
};
// ───── REQUEST OTP ─────
export const requestSignupOtp = async (req, res) => {
  const { pendingId } = req.body;

  const pending = await PendingUser.findById(pendingId);

  if (!pending) {
    return res.status(400).json({ message: "Signup expired" });
  }

  if (!pending.telegramChatId) {
    return res.status(400).json({
      message: "Please connect Telegram first by clicking the bot link.",
    });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  const hashedOtp = await bcrypt.hash(otp, 10);

  await Otp.deleteMany({ userId: pending._id });

  await Otp.create({
    userId: pending._id,
    hashedOtp,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000),
  });

  await bot.api.sendMessage(
    pending.telegramChatId,
    `🔐 Signup OTP: ${otp}\nValid for 5 minutes.`,
  );

  res.json({
    success: true,
    message: "Signup OTP sent to Telegram",
  });
};
export const requestOtp = async (req, res) => {
  const { username } = req.body;

  const user = await User.findOne({ username });
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  if (!user.telegram?.chatId) {
    return res.status(400).json({
      message: "Telegram not linked",
    });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedOtp = await bcrypt.hash(otp, 10);

  await Otp.deleteMany({ userId: user._id });

  await Otp.create({
    userId: user._id,
    hashedOtp,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000),
  });

  await bot.api.sendMessage(
    user.telegram.chatId,
    `🔐 Login OTP: ${otp}\nValid for 5 minutes.`,
  );

  res.json({
    success: true,
    message: "OTP sent to Telegram",
  });
};

// ───── VERIFY SIGNUP OTP ─────
export const verifySignupOtp = async (req, res) => {
  const { pendingId, otp } = req.body;

  const pending = await PendingUser.findById(pendingId);
  if (!pending) {
    return res.status(400).json({ message: "Signup expired" });
  }

  const record = await Otp.findOne({ userId: pending._id });
  if (!record) {
    return res.status(400).json({ message: "OTP expired" });
  }

  if (record.expiresAt < new Date()) {
    return res.status(400).json({ message: "OTP expired" });
  }

  const valid = await bcrypt.compare(otp, record.hashedOtp);
  if (!valid) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  const user = await User.create({
    username: pending.username,
    fullname: pending.fullname,
    password: pending.password,
    telegram: {
      chatId: pending.telegramChatId,
      telegramUsername: pending.telegramUsername,
      linkedAt: new Date(),
    },
  });

  await PendingUser.deleteOne({ _id: pending._id });
  await Otp.deleteMany({ userId: pending._id });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  res.json({
    success: true,
    token,
    user,
  });
};

// ───── VERIFY LOGIN OTP ─────
export const verifyOtpLogin = async (req, res) => {
  const { username, otp } = req.body;

  const user = await User.findOne({ username });
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  const record = await Otp.findOne({ userId: user._id });
  if (!record) {
    return res.status(400).json({ message: "OTP expired" });
  }

  if (record.expiresAt < new Date()) {
    return res.status(400).json({ message: "OTP expired" });
  }

  const isValid = await bcrypt.compare(otp, record.hashedOtp);
  if (!isValid) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  await Otp.deleteMany({ userId: user._id });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  res.json({
    success: true,
    token,
    user,
  });
};
