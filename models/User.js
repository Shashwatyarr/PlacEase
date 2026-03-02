import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },

    fullname: {
      type: String,
      required: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
      index: true,
    },

    telegram: {
      chatId: { type: String, default: null },
      telegramUsername: { type: String, required: true },
      linkedAt: { type: Date },
    },
    dsaStats: {
      totalScore: { type: Number, default: 0 },
      solvedCount: { type: Number, default: 0 },

      difficultyBreakdown: {
        easy: { type: Number, default: 0 },
        medium: { type: Number, default: 0 },
        hard: { type: Number, default: 0 },
      },

      tagScores: [
        {
          tag: String,
          score: Number,
        },
      ],
    },
    platforms: {
      leetcode: {
        username: { type: String },
        verification: {
          code: String,
          verified: { type: Boolean, default: false },
        },
        stats: {
          totalSolved: { type: Number, default: 0 },
          easy: { type: Number, default: 0 },
          medium: { type: Number, default: 0 },
          hard: { type: Number, default: 0 },

          contestRating: { type: Number, default: 0 },
          topPercentage: { type: Number },

          badges: [
            {
              name: String,
              icon: String,
            },
          ],

          lastUpdated: { type: Date },
        },

        ratingHistory: [
          {
            rating: Number,
            date: Date,
          },
        ],
      },

      codeforces: {
        username: { type: String },
        verification: {
          code: String,
          verified: { type: Boolean, default: false },
        },
        stats: {
          rating: { type: Number, default: 0 },
          maxRating: { type: Number, default: 0 },
          rank: { type: String },
          maxRank: { type: String },

          lastUpdated: { type: Date },
        },

        ratingHistory: [
          {
            rating: Number,
            date: Date,
          },
        ],
      },

      github: {
        username: { type: String },
        verification: {
          code: String,
          verified: { type: Boolean, default: false },
        },
        stats: {
          followers: { type: Number, default: 0 },
          following: { type: Number, default: 0 },
          publicRepos: { type: Number, default: 0 },

          contributionsThisYear: { type: Number, default: 0 },

          achievements: [
            {
              title: String,
              icon: String,
            },
          ],

          lastUpdated: { type: Date },
        },
      },
    },
    overallScore: {
      type: Number,
      default: 0,
    },

    creditTitle: {
      type: String,
      default: "Rising Coder",
    },
  },
  { timestamps: true },
);

// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();

//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", userSchema);
