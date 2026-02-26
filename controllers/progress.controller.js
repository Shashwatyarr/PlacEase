import User from "../models/user.model.js";
import DSAProblem from "../models/DSAProblem.model.js";
import UserProblemProgress from "../models/userProblemProgress.model.js";
import Company from "../models/company.model.js";
import Domain from "../models/domain.model.js";
import UserDomainStats from "../models/userDomainStats.model.js";
import UserGlobalStats from "../models/userGlobalStats.model.js";

export const updateProgress = async (req, res) => {
  try {
    const userId = req.user._id;
    const { problemId, status } = req.body;

    if (!["SOLVED", "ATTEMPTED", "REVIEW"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const problem = await DSAProblem.findById(problemId).select(
      "difficulty points companies",
    );

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    const existing = await UserProblemProgress.findOne({
      user: userId,
      problem: problemId,
    });

    let isFirstSolve = false;

    if (!existing && status === "SOLVED") {
      isFirstSolve = true;
    }

    if (existing && existing.status !== "SOLVED" && status === "SOLVED") {
      isFirstSolve = true;
    }

    await UserProblemProgress.findOneAndUpdate(
      { user: userId, problem: problemId },
      {
        status,
        difficultyAtSolve: problem.difficulty,
        scoreEarned: status === "SOLVED" ? problem.points : 0,
        companiesSnapshot: problem.companies,
        solvedAt: status === "SOLVED" ? new Date() : null,
        $inc: { attemptCount: 1 },
      },
      { upsert: true, new: true },
    );

    if (isFirstSolve) {
      await User.findByIdAndUpdate(userId, {
        $inc: {
          "dsaStats.solvedCount": 1,
          "dsaStats.totalScore": problem.points,
          [`dsaStats.difficultyBreakdown.${problem.difficulty.toLowerCase()}`]: 1,
        },
      });
    }

    res.json({ message: "Progress updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getOverviewProgress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("dsaStats");

    const totalProblems = await DSAProblem.estimatedDocumentCount();

    const progressPercentage =
      totalProblems === 0
        ? 0
        : Math.round((user.dsaStats.solvedCount / totalProblems) * 100);

    res.json({
      totalProblems,
      solvedCount: user.dsaStats.solvedCount,
      totalScore: user.dsaStats.totalScore,
      difficultyBreakdown: user.dsaStats.difficultyBreakdown,
      progressPercentage,
    });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const getCompanyProgress = async (req, res) => {
  try {
    const userId = req.user._id;
    const { slug } = req.params;

    const company = await Company.findOne({ slug }).select("_id");

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    const totalProblems = await DSAProblem.countDocuments({
      companies: company._id,
    });

    const solvedCount = await UserProblemProgress.countDocuments({
      user: userId,
      status: "SOLVED",
      companiesSnapshot: company._id,
    });

    const percentage =
      totalProblems === 0 ? 0 : Math.round((solvedCount / totalProblems) * 100);

    res.json({
      totalProblems,
      solvedCount,
      percentage,
    });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const toggleProblemProgress = async (req, res) => {
  try {
    const userId = req.user._id;
    const { problemId } = req.body;

    const problem = await DSAProblem.findById(problemId).select(
      "difficulty points companies",
    );
    const domain = await Domain.findOne({ slug: "dsa" }).select("_id weight");
    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    const existing = await UserProblemProgress.findOne({
      user: userId,
      problem: problemId,
    });

    let newStatus = null;
    let incrementStats = false;
    let decrementStats = false;

    if (!existing) {
      newStatus = "ATTEMPTED";
    } else if (existing.status === "ATTEMPTED") {
      newStatus = "SOLVED";
      incrementStats = true;
    } else if (existing.status === "SOLVED") {
      newStatus = "REVIEW";
      decrementStats = true;
    } else if (existing.status === "REVIEW") {
      newStatus = null; // remove record
    }

    // If moving to SOLVED → increment stats
    if (incrementStats) {
      const weightedPoints = problem.points * (domain?.weight || 1);

      // Update existing DSA stats
      await User.findByIdAndUpdate(userId, {
        $inc: {
          "dsaStats.solvedCount": 1,
          "dsaStats.totalScore": problem.points,
          [`dsaStats.difficultyBreakdown.${problem.difficulty.toLowerCase()}`]: 1,
        },
      });

      // Update Domain Stats
      await UserDomainStats.findOneAndUpdate(
        { user: userId, domain: domain._id },
        {
          $inc: {
            totalScore: weightedPoints,
            solvedCount: 1,
            [`difficultyBreakdown.${problem.difficulty.toLowerCase()}`]: 1,
          },
          $set: { lastActivityAt: new Date() },
        },
        { upsert: true },
      );

      // Update Global Stats
      await UserGlobalStats.findOneAndUpdate(
        { user: userId },
        {
          $inc: {
            totalScore: weightedPoints,
            totalSolved: 1,
          },
        },
        { upsert: true },
      );
    }

    // If moving away from SOLVED → decrement stats
    if (decrementStats) {
      const weightedPoints = problem.points * (domain?.weight || 1);

      await User.findByIdAndUpdate(userId, {
        $inc: {
          "dsaStats.solvedCount": -1,
          "dsaStats.totalScore": -problem.points,
          [`dsaStats.difficultyBreakdown.${problem.difficulty.toLowerCase()}`]:
            -1,
        },
      });

      await UserDomainStats.findOneAndUpdate(
        { user: userId, domain: domain._id },
        {
          $inc: {
            totalScore: -weightedPoints,
            solvedCount: -1,
            [`difficultyBreakdown.${problem.difficulty.toLowerCase()}`]: -1,
          },
        },
      );

      await UserGlobalStats.findOneAndUpdate(
        { user: userId },
        {
          $inc: {
            totalScore: -weightedPoints,
            totalSolved: -1,
          },
        },
      );
    }

    if (newStatus === null) {
      await UserProblemProgress.deleteOne({
        user: userId,
        problem: problemId,
      });

      return res.json({ status: null });
    }

    const updated = await UserProblemProgress.findOneAndUpdate(
      { user: userId, problem: problemId },
      {
        status: newStatus,
        difficultyAtSolve: problem.difficulty,
        scoreEarned: newStatus === "SOLVED" ? problem.points : 0,
        companiesSnapshot: problem.companies,
        solvedAt: newStatus === "SOLVED" ? new Date() : null,
        $inc: { attemptCount: 1 },
      },
      { upsert: true, new: true },
    );

    res.json({ status: updated.status });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};
