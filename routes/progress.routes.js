import express from "express";
import {
  updateProgress,
  getOverviewProgress,
  getCompanyProgress,
  toggleProblemProgress,
} from "../controllers/progress.controller.js";

import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(protect);

router.patch("/problem/:problemId/toggle", toggleProblemProgress);

router.patch("/problem/:problemId", updateProgress);

router.get("/overview", getOverviewProgress);

router.get("/company/:slug", getCompanyProgress);

export default router;
