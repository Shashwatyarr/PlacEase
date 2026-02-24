import mongoose from "mongoose";
import { InterviewItem } from "./interviewItem.model.js";

const shortAnswerSchema = new mongoose.Schema({
  questionMarkdown: {
    type: String,
    required: true,
  },

  answerMarkdown: {
    type: String,
    required: true,
  },

  keyPoints: [
    {
      type: String,
    },
  ],

  evaluationMode: {
    type: String,
    enum: ["manual", "ai-evaluated"],
    default: "manual",
  },
});

export const ShortAnswer = InterviewItem.discriminator(
  "short-answer",
  shortAnswerSchema,
);
