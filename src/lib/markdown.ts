import MarkdownIt from 'markdown-it';

const md = new MarkdownIt({
  html: true,
});

export function parseMarkdown(content: string): string {
  if (typeof content !== "string") return "";

  const withYiddish = content.replace(
    /\{\{yi:(.*?)\}\}/g,
    '<span class="font-yiddish">$1</span>');

  return md.render(withYiddish);
}