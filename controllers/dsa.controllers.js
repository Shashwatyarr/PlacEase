import DSAProblem from "../models/DSAProblem.model.js";
import Company from "../models/company.model.js";

export const getDSAProblems = async (req, res) => {
  try {
    const {
      company,
      category,
      difficulty,
      tags,
      search,
      sort = "frequency",
      page = 1,
      limit = 20,
    } = req.query;

    const query = { visibility: "public" };

    if (company) {
      const companyDoc = await Company.findOne({ slug: company });
      if (companyDoc) {
        query.companies = companyDoc._id;
      }
    }
    if (category) {
      const companies = await Company.find({ category }).select("_id");
      const ids = companies.map((c) => c._id);
      query.companies = { $in: ids };
    }
    if (search) {
      query.$text = { $search: search };
    }
    let sortOption = {};
    if (sort === "frequency") sortOption = { frequencyScore: -1 };
    if (sort === "acceptance") sortOption = { acceptanceRate: 1 };
    if (sort === "newest") sortOption = { createdAt: -1 };

    const results = await DSAProblem.find(query)
      .populate("companies", "slug name logoUrl")
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await DSAProblem.countDocuments(query);

    res.json({
      total,
      page: Number(page),
      limit: Number(limit),
      results,
    });
  } catch (error) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};
