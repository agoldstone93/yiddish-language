This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/pages/api-reference/create-next-app).

## Getting Started

1. Run `npm install`

1. Run the development server:

    ```bash
    npm run dev
    # or
    yarn dev
    # or
    pnpm dev
    # or
    bun dev
    ```

1. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

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

## Contributing

If you'd like to contribute to this repository, feel free to open a pull request or get in touch if you have any questions.