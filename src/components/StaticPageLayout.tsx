import { parseMarkdown } from "@/lib/markdown";

type StaticPageLayoutProps = {
  title: string;
  content: string;
};

export default function StaticPageLayout({
  title,
  content,
}: StaticPageLayoutProps) {
  const html = parseMarkdown(content);

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-8">
      <h1 className="text-3xl font-bold">{title}</h1>
      <div
        className="text-gray-600 dark:text-gray-400 prose dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
