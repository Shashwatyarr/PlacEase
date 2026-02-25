import express from "express";
import { getDSAProblems } from "../controllers/dsa.controllers.js";

const router = express.Router();

router.get("/", getDSAProblems);

export default router;
