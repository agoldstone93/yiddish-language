import { parseMarkdown } from "@/lib/markdown";

type StaticPageLayoutProps = {
  title: string;
  content: string;
  exampleText?: string;
  exampleHref?: string;
};

export default function StaticPageLayout({
  title,
  content,
  exampleText,
  exampleHref,
}: StaticPageLayoutProps) {
  const html = parseMarkdown(content);

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-8">
      <h1 className="text-3xl font-bold space-y-1">
        <div>{title}</div>
      </h1>
      {exampleText && exampleHref && (
        <div className="text-gray-600 dark:text-gray-400 prose dark:prose-invert text-sm font-medium">
          <span className="mr-2">Example:</span>
          <a href={exampleHref} className="underline-offset-2 hover:underline">
            {exampleText}
          </a>
        </div>
      )}
      <div
        className="text-gray-600 dark:text-gray-400 prose dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
