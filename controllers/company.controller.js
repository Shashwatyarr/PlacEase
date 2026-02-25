import Company from "../models/company.model.js";

export const getCompanies = async (req, res) => {
  try {
    const { category, sort = "popularity" } = req.query;
    const query = {};
    if (category) query.category = category;
    let sortOptions = {};
    if (sort === "popularity") sortOptions = { popularityScore: -1 };
    if (sort === "problems") sortOptions = { problemCount: -1 };

    const companies = await Company.find(query)
      .sort(sortOptions)
      .select("slug name logoUrl category popularityScore problemCount");

    res.json(companies);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};
