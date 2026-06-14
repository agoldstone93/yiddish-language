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
        <div className="content-prose">
          <span className="mr-2">Example:</span>
          <a href={exampleHref} className="app-link">
            {exampleText}
          </a>
        </div>
      )}
      <div
        className="content-prose"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
