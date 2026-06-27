This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

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

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Security & Route Authorization

### Frontend Route Guards (UX Layer)

Every role-specific route group is wrapped with `RouteGuard` (`features/auth/components/RouteGuard.tsx`):

| Route group | `allow` |
|---|---|
| `app/(buyer)/**` | `["BUYER"]` |
| `app/(seller)/**` | `["SELLER"]` |
| `app/(driver)/**` | `["DRIVER"]` |
| `app/(admin)/**` | `["ADMIN"]` |

Guard behavior:
- Not logged in → redirect `/login`
- Logged in but no active role → redirect `/select-role`
- Wrong role → redirect to `roleHome(activeRole)` (the user's own dashboard)

Role-gated UI elements:
- Cart icon in Navbar / BottomNav → only `BUYER`
- Add-to-cart button on product pages → only `BUYER`
- BottomNav items are fully segmented per role (`ROLE_ITEMS[role]`)
- CartContext only fetches when `activeRole === "BUYER"` (prevents 401 for guests/other roles)

> **Important:** Frontend guards are a UX convenience only — they prevent accidental navigation and hide irrelevant UI. **Real authorization is enforced by the backend** on every API call. A user who bypasses the FE guard (e.g., by manipulating localStorage or calling the API directly) will still be rejected by the BE with 401/403. Never rely on the FE guard as a security boundary.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
