import { getPage } from "@/lib/pages";
import { parseMarkdown } from "@/lib/markdown";
import { GetStaticProps } from "next";

type AboutProps = {
  page: {
    title: string;
    content: string;
  };
};

export const getStaticProps: GetStaticProps<AboutProps> = async () => {
  const page = getPage("about");
  if (!page) return { notFound: true };
  return { props: { page } };
};

export default function About({ page }: AboutProps) {
  const html = parseMarkdown(page.content);

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-8">
      <h1 className="text-3xl font-bold">{page.title}</h1>
      <div 
        className="text-gray-600 dark:text-gray-400 prose dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}