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

The CMS configuration is managed in a single file: [public/admin/config.yml](public/admin/config.yml)

### Local Development (with Decap local backend)

```bash
npm run dev
npx decap-server   # in another terminal
```

- `config.base.yml` (tracked) holds the real CMS config with `local_backend: false`
- `config.local.yml` (gitignored) only contains `local_backend: true`
- The script `scripts/switch-decap-config.mjs` merges these into `config.yml` (gitignored)
- Decap CMS reads `/admin/config.yml`

### Testing Production Mode Locally

```bash
npm run dev:prod
```

This copies `config.base.yml` to `config.yml` (no local backend) so you can test Netlify Identity.

### Notes

- Edit `public/admin/config.base.yml` for any CMS changes
- Keep `public/admin/config.yml` out of git (it’s generated)
- `config.local.yml` is optional; if missing, prod mode is used

## Contributing

If you'd like to contribute to this repository, feel free to open a pull request or get in touch if you have any questions.
