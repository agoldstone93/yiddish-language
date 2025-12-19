This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/pages/api-reference/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Decap CMS (Admin)

This repo keeps production vs local Decap CMS settings separate so `local_backend: true` is never committed.

- Production config lives in [public/admin/config.prod.yml](public/admin/config.prod.yml)
- Local-only override should be created at `public/admin/config.local.yml` (gitignored)

To set up local CMS config:

```bash
cp public/admin/config.local.example.yml public/admin/config.local.yml
```

When you run `npm run dev`, it automatically copies the local config (if present) into `public/admin/config.yml`.
When you run `npm run build`, it automatically copies the prod config into `public/admin/config.yml`.

To run the dev server with the production CMS config (useful for testing Netlify Identity login/signup), use:

```bash
npm run dev:prod
```

If you have `local_backend: true` enabled (via `public/admin/config.local.yml`), you also need to run Decap’s local backend server in another terminal while developing:

```bash
npx decap-server
```

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/pages/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn-pages-router) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/pages/building-your-application/deploying) for more details.
