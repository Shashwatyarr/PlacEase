import express from "express";
import {
  getGlobalLeaderboard,
  getDomainLeaderboard,
  getMyGlobalRank,
  getMyDomainRank,
} from "../controllers/leaderboard.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect);

router.get("/global", getGlobalLeaderboard);
router.get("/domain/:slug", getDomainLeaderboard);
router.get("/me/global-rank", getMyGlobalRank);
router.get("/me/domain-rank/:slug", getMyDomainRank);

export default router;
