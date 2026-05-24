import fs from "fs";
import path from "path";
import yaml from "js-yaml";

const verbsDir = path.join(process.cwd(), "content/verbs");
const files = fs.readdirSync(verbsDir).filter((file) => file.endsWith(".yml"));

for (const file of files) {
  const filePath = path.join(verbsDir, file);
  const raw = fs.readFileSync(filePath, "utf8");
  const data = yaml.load(raw);

  if (!data || typeof data !== "object" || Array.isArray(data)) continue;
  if (data.senses) continue;
  if (!data.meaning?.english) continue;

  const migrated = {};

  for (const [key, value] of Object.entries(data)) {
    if (key === "meaning") {
      migrated.senses = [{ english: value.english }];
      continue;
    }

    migrated[key] = value;
  }

  fs.writeFileSync(
    filePath,
    yaml.dump(migrated, {
      lineWidth: -1,
      noRefs: true,
    }),
    "utf8"
  );

  console.log(`migrated ${file}`);
}
