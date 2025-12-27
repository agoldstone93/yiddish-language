import MarkdownIt from 'markdown-it';

const md = new MarkdownIt();

export function parseMarkdown(content: string): string {
  if (typeof content !== "string") return "";
  return md.render(content);
}