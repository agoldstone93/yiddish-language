import fs from "fs";
import path from "path";
import yaml from "js-yaml";

export type Page = {
  title: string;
  slug: string;
  content: string;
};

const pagesDir = path.join(process.cwd(), "content", "pages");

export function getAllPages(): Page[] {
  const files = fs.readdirSync(pagesDir).filter((f) => f.endsWith(".yml"));
  return files.map((file) => {
    const raw = fs.readFileSync(path.join(pagesDir, file), "utf8");
    const page = yaml.load(raw) as Page;
    return { ...page, slug: page.slug || path.parse(file).name };
  });
}

export function getPage(slug: string): Page | null {
  const filePath = path.join(pagesDir, `${slug}.yml`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf8");
  const page = yaml.load(raw) as Page;
  return { ...page, slug };
}