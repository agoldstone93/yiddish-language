import fs from "fs";
import path from "path";
import yaml from "js-yaml";
import type { Noun } from "@/types/noun";

const nounsDir = path.join(process.cwd(), "content/nouns");

export function getAllNouns(): Noun[] {
  const files = fs.readdirSync(nounsDir).filter((file) => file.endsWith(".yml"));

  return files.map((file) => {
    const raw = fs.readFileSync(path.join(nounsDir, file), "utf8");
    return yaml.load(raw) as Noun;
  });
}

export function getNoun(id: string): Noun | null {
  const filePath = path.join(nounsDir, `${id}.yml`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf8");
  return yaml.load(raw) as Noun;
}
