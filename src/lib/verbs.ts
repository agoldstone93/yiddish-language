import fs from "fs";
import path from "path";
import yaml from "js-yaml";
import type { Verb } from "@/types/verb";

const verbsDir = path.join(process.cwd(), "content/verbs");

export function getVerb(id: string): Verb | null {
  const filePath = path.join(verbsDir, `${id}.yml`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf8");
  return yaml.load(raw) as Verb;
}

export function getAllVerbs(): Verb[] {
  const files = fs.readdirSync(verbsDir);

  return files.map((file) => {
    const raw = fs.readFileSync(path.join(verbsDir, file), "utf8");
    return yaml.load(raw) as Verb;
  });
}
