import Head from "next/head";
import StaticPageLayout from "@/components/StaticPageLayout";
import { getStaticPaths, getStaticProps } from "@/lib/staticPageProps";
import { usePathname } from 'next/navigation'

type PageProps = {
  page: {
    title: string;
    content: string;
  };
};

export { getStaticPaths, getStaticProps };

export default function Page({ page }: PageProps) {
  return (
    <>
      <Head>
        <title>{`${page.title} - LoshnLab`}</title>
        <meta name="description" content={`${page.title} - Yiddish learning resource and verb conjugator`} />
        <meta property="og:title" content={`LoshnLab - ${page.title}`} />
        <meta property="og:description" content={`${page.title} - Yiddish learning resource and verb conjugator`} />
        <meta property="og:url" content={`https://loshnlab.com${usePathname()}`} />
      </Head>
      <StaticPageLayout {...page} />
    </>
  );
}
