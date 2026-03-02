import express from "express";
import { updateAndGetCreditScore } from "../controllers/credit.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/credit-score", protect, updateAndGetCreditScore);

export default router;
