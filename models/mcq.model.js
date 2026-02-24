import mongoose from "mongoose";
import { InterviewItem } from "./interviewItem.model.js";

const mcqSchema = new mongoose.Schema({
  questionMarkdown: {
    type: String,
    required: true,
  },

  options: [
    {
      optionId: {
        type: String,
        required: true,
      },
      text: {
        type: String,
        required: true,
      },
    },
  ],

  correctOptionIds: [
    {
      type: String,
      required: true,
    },
  ],

  explanationMarkdown: {
    type: String,
  },

  scoring: {
    type: String,
    enum: ["single", "multiple"],
    default: "single",
  },
});

export const MCQ = InterviewItem.discriminator("mcq", mcqSchema);
