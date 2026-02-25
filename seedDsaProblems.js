import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import csv from "csv-parser";
import { fileURLToPath } from "url";
import DSAProblem from "./models/DSAProblem.model.js";
import Company from "./models/company.model.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_DIR = path.join(__dirname, "./seed/CompanyData");

// Normalize tag
function normalizeTag(tag) {
  return tag.toLowerCase().trim().replace(/\s+/g, "-");
}

// Extract slug safely
function extractSlug(link) {
  const parts = link.split("/problems/");
  if (parts.length < 2) return null;
  return parts[1].replace("/", "").toLowerCase().trim();
}

// Points mapping
function mapPoints(difficulty) {
  if (difficulty === "EASY") return 10;
  if (difficulty === "MEDIUM") return 20;
  if (difficulty === "HARD") return 40;
  return 10;
}

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);

  console.log("🔄 Loading companies...");
  const companies = await Company.find();
  const companyMap = {};

  companies.forEach((c) => {
    companyMap[c.slug] = c._id;
  });

  const folders = fs.readdirSync(BASE_DIR);

  for (const companySlug of folders) {
    const folderPath = path.join(BASE_DIR, companySlug);

    if (!fs.lstatSync(folderPath).isDirectory()) continue;

    const companyId = companyMap[companySlug];
    if (!companyId) {
      console.log(`⚠ Company not found in DB: ${companySlug}`);
      continue;
    }

    const csvPath = path.join(folderPath, "all.csv");
    if (!fs.existsSync(csvPath)) continue;

    console.log(`📦 Processing ${companySlug}...`);

    const bulkOps = [];

    await new Promise((resolve) => {
      fs.createReadStream(csvPath)
        .pipe(csv())
        .on("data", (row) => {
          const title = row.Title?.trim();
          const difficulty = row.Difficulty?.toUpperCase().trim();
          const link = row.URL?.trim();

          if (!title || !difficulty || !link) return;

          const slug = extractSlug(link);
          if (!slug) return;

          // Frequency % like "75.0%"
          const frequencyRaw = row["Frequency %"]?.replace("%", "").trim();
          const frequency = frequencyRaw ? Number(frequencyRaw) : 0;

          // Acceptance % like "57.1%"
          const acceptanceRaw = row["Acceptance %"]?.replace("%", "").trim();
          const acceptance = acceptanceRaw ? Number(acceptanceRaw) : null;

          bulkOps.push({
            updateOne: {
              filter: { slug },
              update: {
                $setOnInsert: {
                  slug,
                  title,
                  difficulty,
                  acceptanceRate: acceptance,
                  tags: [], // not present in your CSV
                  points: mapPoints(difficulty),
                  externalLink: link,
                  visibility: "public",
                },
                $addToSet: {
                  companies: companyId,
                },
                $inc: {
                  frequencyScore: frequency,
                },
              },
              upsert: true,
            },
          });
        })
        .on("end", resolve);
    });

    if (bulkOps.length > 0) {
      await DSAProblem.bulkWrite(bulkOps);
      console.log(`✅ ${bulkOps.length} operations for ${companySlug}`);
    }
  }

  console.log("🎯 DSA seeding completed");
  process.exit();
}

seed();
