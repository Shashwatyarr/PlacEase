import User from "../models/user.model.js";

const calculateCreditScore = (user) => {
  let lcScore = 0;
  let cfScore = 0;
  let ghScore = 0;

  const lc = user.platforms?.leetcode?.stats;

  if (lc) {
    const totalSolvedScore = Math.min((lc.totalSolved || 0) / 500, 1) * 120;

    const hardSolvedScore = Math.min((lc.hard || 0) / 100, 1) * 80;

    const ratingScore = Math.min((lc.contestRating || 0) / 2500, 1) * 90;

    const badgeBonus = Math.min((lc.badges?.length || 0) * 5, 25);

    lcScore = totalSolvedScore + hardSolvedScore + ratingScore + badgeBonus;
  }

  const cf = user.platforms?.codeforces?.stats;

  if (cf) {
    cfScore = Math.min((cf.rating || 0) / 3000, 1) * 360;
  }

  const gh = user.platforms?.github?.stats;

  if (gh) {
    const contributionScore =
      Math.min((gh.contributionsThisYear || 0) / 1000, 1) * 120;

    const followerScore = Math.min((gh.followers || 0) / 200, 1) * 40;

    const repoScore = Math.min((gh.publicRepos || 0) / 50, 1) * 40;

    const achievementBonus = Math.min((gh.achievements?.length || 0) * 5, 25);

    ghScore = contributionScore + followerScore + repoScore + achievementBonus;
  }

  return Math.round(lcScore + cfScore + ghScore);
};

const getCreditTitle = (score) => {
  if (score < 400) return "Rising Coder";
  if (score < 600) return "Consistent Solver";
  if (score < 750) return "Competitive Programmer";
  if (score < 850) return "Advanced Competitor";
  return "Elite Engineer";
};

export const updateAndGetCreditScore = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) return res.status(404).json({ message: "User not found" });

    const score = calculateCreditScore(user);
    const title = getCreditTitle(score);

    user.overallScore = score;
    user.creditTitle = title;

    await user.save();

    res.status(200).json({
      success: true,
      overallScore: score,
      creditTitle: title,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error calculating credit score",
    });
  }
};
