import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import User from "./models/User.js";

await mongoose.connect(process.env.MONGO_URI);

await User.updateOne({ username: "shashwat123" }, { $set: { role: "admin" } });

console.log("User promoted to admin");

process.exit();
