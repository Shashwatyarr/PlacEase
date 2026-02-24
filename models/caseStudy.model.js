import mongoose from "mongoose";
import { InterviewItem } from "./interviewItem.model.js";

const caseStudySchema = new mongoose.Schema({
  problemStatementMarkdown: {
    type: String,
    required: true,
  },

  expectedDiscussionPoints: [
    {
      type: String,
    },
  ],

  referenceSolutionMarkdown: {
    type: String,
  },

  evaluationRubric: [
    {
      criteria: String,
      weight: Number,
    },
  ],
});

export const CaseStudy = InterviewItem.discriminator(
  "case-study",
  caseStudySchema,
);
