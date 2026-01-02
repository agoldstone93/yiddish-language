import fs from "fs";
import path from "path";
import yaml from "js-yaml";
import StaticPageLayout from "@/components/StaticPageLayout";
import { getAllCategories, getCategory } from "@/lib/categories";
import { GetStaticPaths, GetStaticProps } from "next";

type CategoryPageProps = {
	category: {
		name: string;
		content: string;
		exampleHref?: string;
		exampleText?: string;
	};
};

export const getStaticPaths: GetStaticPaths = async () => {
	const categories = getAllCategories();
	return {
		paths: categories.map((cat) => ({ params: { slug: cat.id } })),
		fallback: false,
	};
};

export const getStaticProps: GetStaticProps<CategoryPageProps> = async ({
	params,
}) => {
	const slug = params?.slug as string;
	const category = getCategory(slug);
	if (!category) return { notFound: true };
	const exampleSlug = category.exampleSlug;

	// Try to get a Yiddish lemma from the verb file matching the example slug
	let exampleDisplay = category.exampleLabel || exampleSlug;
	if (exampleSlug) {
		const verbPath = path.join(process.cwd(), "content/verbs", `${exampleSlug}.yml`);
		if (fs.existsSync(verbPath)) {
			const raw = fs.readFileSync(verbPath, "utf8");
			const verb = yaml.load(raw) as { lemma?: { yiddish?: string } };
			if (verb?.lemma?.yiddish) {
				exampleDisplay = verb.lemma.yiddish;
			}
		}
	}

	const exampleLabel = exampleDisplay;
	const exampleHref = exampleSlug ? `/verbs/${exampleSlug}` : undefined;
	return {
		props: {
			category: {
				name: category.name,
				content: category.content,
				exampleHref,
				exampleText: exampleLabel,
			},
		},
	};
};

export default function CategoryPage({ category }: CategoryPageProps) {
	return (
		<StaticPageLayout
			title={category.name}
			content={category.content}
			exampleHref={category.exampleHref}
			exampleText={category.exampleText}
		/>
	);
}
