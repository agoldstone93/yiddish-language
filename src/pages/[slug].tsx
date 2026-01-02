import StaticPageLayout from "@/components/StaticPageLayout";
import { getStaticPaths, getStaticProps } from "@/lib/staticPageProps";

type PageProps = {
  page: {
    title: string;
    content: string;
  };
};

export { getStaticPaths, getStaticProps };

export default function Page({ page }: PageProps) {
  return <StaticPageLayout {...page} />;
}
