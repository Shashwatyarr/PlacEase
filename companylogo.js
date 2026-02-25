import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import * as simpleIcons from "simple-icons";

// Fix __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load company category map
const companiesPath = path.join(__dirname, "public/companies/companies.json");

const companies = JSON.parse(fs.readFileSync(companiesPath, "utf-8"));

function normalize(str) {
  return str.toLowerCase().replace(/[^a-z0-9]/g, "");
}

// Extract only valid icon objects
const allIcons = Object.values(simpleIcons).filter(
  (val) => typeof val === "object" && val.title,
);

const iconMap = {};

// IMPORTANT CHANGE HERE
for (const companySlug of Object.keys(companies)) {
  const normalizedCompany = normalize(companySlug);

  let found = null;

  for (const icon of allIcons) {
    const normalizedIconTitle = normalize(icon.title);

    if (normalizedCompany === normalizedIconTitle) {
      found = icon.slug;
      break;
    }
  }

  iconMap[companySlug] = found; // null if not found
}

fs.writeFileSync(
  path.join(__dirname, "simpleIconSlugMap.generated.json"),
  JSON.stringify(iconMap, null, 2),
);

console.log("✅ Generated verified SimpleIcons slug map");
