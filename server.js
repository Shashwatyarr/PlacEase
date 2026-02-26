import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import connectdb from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import "./utils/send_telegram.js";
import dsaRoutes from "./routes/dsa.routes.js";
import progressRoutes from "./routes/progress.routes.js";
import leaderboardRoutes from "./routes/leaderboard.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

connectdb();

app.use("/api/auth", authRoutes);
app.use("/api/dsa", dsaRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.get("/", (req, res) => {
  res.send("Backend is running...");
});

const PORT = 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend is running on port: ${PORT}`);
});
