import { getPage, getAllPages } from "@/lib/pages";
import { GetStaticPaths, GetStaticProps } from "next";

type PageData = {
  title: string;
  content: string;
};

export const getStaticPaths: GetStaticPaths = async () => {
  const pages = getAllPages();
  return {
    paths: pages.map((page) => ({
      params: { slug: page.slug },
    })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<{ page: PageData }> = async ({
  params,
}) => {
  const slug = params?.slug as string;
  const page = getPage(slug);
  if (!page) return { notFound: true };
  return { props: { page } };
};
