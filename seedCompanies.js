import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Company from "./models/company.model.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load category map
const categoryMap = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, "./public/companies/companies.json"),
    "utf-8",
  ),
);

// Load icon slug map
const iconSlugMap = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, "./simpleIconSlugMap.generated.json"),
    "utf-8",
  ),
);

// Indian mass recruiters
const MASS_RECRUITERS = new Set([
  "tcs",
  "infosys",
  "wipro",
  "hcl",
  "tech-mahindra",
  "cognizant",
  "capgemini",
  "accenture",
  "genpact",
  "lti",
  "mindtree",
  "nagarro",
  "epam-systems",
]);

// Slug → Display Name
function formatDisplayName(slug) {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

// Generate logo URL
function getLogoUrl(slug) {
  const iconSlug = iconSlugMap[slug];
  if (!iconSlug) return null;

  return `https://cdn.simpleicons.org/${iconSlug}`;
}

// Assign popularity score
function getPopularityScore(slug, category) {
  if (category === "faang") return 300;
  if (category === "big-tech") return 200;
  if (MASS_RECRUITERS.has(slug)) return 100;
  return 0;
}

async function seedCompanies() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const bulkOps = [];

    for (const slug of Object.keys(categoryMap)) {
      const category = categoryMap[slug];

      bulkOps.push({
        updateOne: {
          filter: { slug },
          update: {
            $set: {
              slug,
              name: formatDisplayName(slug),
              category,
              logoUrl: getLogoUrl(slug),
              popularityScore: getPopularityScore(slug, category),
            },
          },
          upsert: true,
        },
      });
    }

    if (bulkOps.length > 0) {
      await Company.bulkWrite(bulkOps);
    }

    console.log(`✅ Seeded ${bulkOps.length} companies successfully`);
    process.exit();
  } catch (err) {
    console.error("❌ Error seeding companies:", err);
    process.exit(1);
  }
}

seedCompanies();
