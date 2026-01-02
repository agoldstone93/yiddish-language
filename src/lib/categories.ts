import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { parseMarkdown } from '@/lib/markdown';

export type Category = {
	id: string;
	name: string;
	exampleSlug?: string;
	exampleLabel?: string;
	content: string; // Markdown text managed in CMS
};

const categoriesDir = path.join(process.cwd(), 'content', 'categories');

export function getAllCategories(): Category[] {
	if (!fs.existsSync(categoriesDir)) return [];
	const files = fs.readdirSync(categoriesDir).filter((f) => f.endsWith('.yml'));
	return files.map((file) => {
		const raw = fs.readFileSync(path.join(categoriesDir, file), 'utf8');
		const data = yaml.load(raw) as Partial<Category> & {
			example?: string;
			example_slug?: string;
			example_label?: string;
		};
		// Fallback id from slug or filename if missing
		const id = (data.id as string) || (data as any).slug || path.parse(file).name;
		const name = (data.name as string) || id;
		const content = (data.content as string) || '';
		const exampleSlug =
			(data.example_slug as string) || (data.example as string) || '';
		const exampleLabel =
			(data.example_label as string) || (exampleSlug ? `e.g. ${exampleSlug}` : '');
		return { id, name, content, exampleSlug, exampleLabel };
	});
}

export function getCategory(id: string): Category | null {
	const filePath = path.join(categoriesDir, `${id}.yml`);
	if (!fs.existsSync(filePath)) return null;
	const raw = fs.readFileSync(filePath, 'utf8');
	const data = yaml.load(raw) as Partial<Category> & {
		slug?: string;
		example?: string;
		example_slug?: string;
		example_label?: string;
	};
	const finalId = (data.id as string) || data.slug || id;
	const name = (data.name as string) || finalId;
	const content = (data.content as string) || '';
	const exampleSlug =
		(data.example_slug as string) || (data.example as string) || '';
	const exampleLabel =
		(data.example_label as string) || (exampleSlug ? `e.g. ${exampleSlug}` : '');
	return { id: finalId, name, content, exampleSlug, exampleLabel };
}

export function getCategoriesMap(): Record<string, Category> {
	return getAllCategories().reduce((acc, cat) => {
		acc[cat.id] = cat;
		return acc;
	}, {} as Record<string, Category>);
}

export function renderCategoryContent(markdown: string): string {
	return parseMarkdown(markdown);
}

