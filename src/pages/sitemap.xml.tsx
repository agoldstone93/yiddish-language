import { GetServerSideProps } from 'next';
import { getAllVerbs } from '@/lib/verbs';
import { getAllPages } from '@/lib/pages';
import { getAllCategories } from '@/lib/categories';

function generateSiteMap(baseUrl: string) {
  const verbs = getAllVerbs();
  const pages = getAllPages();
  const categories = getAllCategories();
  const buildDate = new Date().toISOString();

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${buildDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/verbs</loc>
    <lastmod>${buildDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  ${pages
    .map(
      (page) => `
  <url>
    <loc>${baseUrl}/${page.slug}</loc>
    <lastmod>${buildDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`
    )
    .join('')}
  ${categories
    .map(
      (cat) => `
  <url>
    <loc>${baseUrl}/categories/${cat.id}</loc>
    <lastmod>${buildDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`
    )
    .join('')}
  ${verbs
    .map(
      (verb) => `
  <url>
    <loc>${baseUrl}/verbs/${verb.id}</loc>
    <lastmod>${buildDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`
    )
    .join('')}
</urlset>`;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const baseUrl = 'https://loshnlab.com';
  
  const sitemap = generateSiteMap(baseUrl);

  res.setHeader('Content-Type', 'text/xml');
  res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate');
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
};

export default function SiteMap() {}
