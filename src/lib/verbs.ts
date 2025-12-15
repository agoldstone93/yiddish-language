import fs from "fs";
import path from "path";
import yaml from "js-yaml";
import type { Verb } from "@/types/verb";

const verbsDir = path.join(process.cwd(), "content/verbs");

export function getAllVerbs(): Verb[] {
  const files = fs.readdirSync(verbsDir);

  return files.map((file) => {
    const raw = fs.readFileSync(path.join(verbsDir, file), "utf8");
    return yaml.load(raw) as Verb;
  });
}
