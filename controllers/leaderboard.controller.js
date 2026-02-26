import UserGlobalStats from "../models/userGlobalStats.model.js";
import Domain from "../models/domain.model.js";
import UserDomainStats from "../models/userDomainStats.model.js";

export const getGlobalLeaderboard = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const skip = (page - 1) * limit;

    const totalUsers = await UserGlobalStats.countDocuments();

    const leaderboard = await UserGlobalStats.find()
      .sort({ totalScore: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user", "username fullname");

    const formatted = leaderboard.map((entry, index) => ({
      rank: skip + index + 1,
      userId: entry.user._id,
      username: entry.user.username,
      fullname: entry.user.fullname,
      totalScore: entry.totalScore,
      totalSolved: entry.totalSolved,
    }));

    res.json({
      page,
      totalPages: Math.ceil(totalUsers / limit),
      totalUsers,
      leaderboard: formatted,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getDomainLeaderboard = async (req, res) => {
  try {
    const { slug } = req.params;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const domain = await Domain.findOne({ slug }).select("_id name");

    if (!domain) {
      return res.status(404).json({ message: "Domain not found" });
    }

    const totalUsers = await UserDomainStats.countDocuments({
      domain: domain._id,
    });

    const leaderboard = await UserDomainStats.find({
      domain: domain._id,
    })
      .sort({ totalScore: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user", "username fullname");

    const formatted = leaderboard.map((entry, index) => ({
      rank: skip + index + 1,
      userId: entry.user._id,
      username: entry.user.username,
      fullname: entry.user.fullname,
      totalScore: entry.totalScore,
      solvedCount: entry.solvedCount,
    }));

    res.json({
      domain: domain.name,
      page,
      totalPages: Math.ceil(totalUsers / limit),
      totalUsers,
      leaderboard: formatted,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getMyGlobalRank = async (req, res) => {
  try {
    const userId = req.user._id;

    const myStats = await UserGlobalStats.findOne({ user: userId });

    if (!myStats) {
      return res.json({ rank: null, totalScore: 0 });
    }

    const betterUsersCount = await UserGlobalStats.countDocuments({
      totalScore: { $gt: myStats.totalScore },
    });

    const rank = betterUsersCount + 1;

    res.json({
      rank,
      totalScore: myStats.totalScore,
    });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const getMyDomainRank = async (req, res) => {
  try {
    const { slug } = req.params;
    const userId = req.user._id;

    const domain = await Domain.findOne({ slug }).select("_id");

    if (!domain) {
      return res.status(404).json({ message: "Domain not found" });
    }

    const myStats = await UserDomainStats.findOne({
      user: userId,
      domain: domain._id,
    });

    if (!myStats) {
      return res.json({ rank: null, totalScore: 0 });
    }

    const betterUsersCount = await UserDomainStats.countDocuments({
      domain: domain._id,
      totalScore: { $gt: myStats.totalScore },
    });

    const rank = betterUsersCount + 1;

    res.json({
      rank,
      totalScore: myStats.totalScore,
    });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};
