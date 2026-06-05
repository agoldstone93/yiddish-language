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
    <div className="page-shell space-y-6">
      <h1>{title}</h1>
      {exampleText && exampleHref && (
        <div className="muted-text prose dark:prose-invert">
          <span className="mr-2">Example:</span>
          <a href={exampleHref} className="underline-offset-2 hover:underline">
            {exampleText}
          </a>
        </div>
      )}
      <div
        className="muted-text prose dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
