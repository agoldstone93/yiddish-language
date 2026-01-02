import { GetServerSideProps } from 'next';
import { getAllVerbs } from '@/lib/verbs';
import { getAllPages } from '@/lib/pages';
import { getAllCategories } from '@/lib/categories';

function generateSiteMap(baseUrl: string) {
  const verbs = getAllVerbs();
  const pages = getAllPages();
  const categories = getAllCategories();

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/verbs</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  ${pages
    .map(
      (page) => `
  <url>
    <loc>${baseUrl}/${page.slug}</loc>
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
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`
    )
    .join('')}
</urlset>`;
}

function SiteMap() {
  // getServerSideProps will do the work
}

export const getServerSideProps: GetServerSideProps = async ({ res, req }) => {
  const protocol = req.headers.host?.includes('localhost') ? 'http' : 'https';
  const baseUrl = `${protocol}://${req.headers.host}`;
  
  const sitemap = generateSiteMap(baseUrl);

  res.setHeader('Content-Type', 'text/xml');
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
};

export default SiteMap;
