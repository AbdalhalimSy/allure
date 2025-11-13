# Allure Casting Platform

A modern, bilingual casting and talent platform built with Next.js, TypeScript, and Tailwind CSS.

## Features
- Talents/models can create profiles and apply to casting calls
- Clients/brands can post jobs and discover talents
- Bilingual support (English & Arabic)
- Responsive, SEO-friendly design
- Atomic design UI components
- React Query for data fetching
- Zod for form validation
- Placeholder API functions for easy integration

## Tech Stack
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- next-intl (i18n)
- React Query
- React Hook Form + Zod
- Axios
- Jest + React Testing Library

## Project Structure
```
/src
 ├── app/
 ├── components/
 ├── hooks/
 ├── lib/
 ├── locales/
 ├── types/
 ├── utils/
 ├── middleware.ts
 └── tests/
```

## Adding Pages
- Create a new folder in `/src/app/(public)/` for public pages
- For dashboard pages, use `/src/app/(dashboard)/`
- Add your page as `page.tsx` inside the folder

## Adding API Endpoints
- Add endpoint paths in `/src/lib/api/endpoints.ts`
- Implement API calls using Axios in `/src/lib/api/client.ts`
- Use React Query hooks in `/src/hooks/`

## Adding Translations
- Add translation keys in `/src/locales/en/*.json` and `/src/locales/ar/*.json`
- Use next-intl or next-i18next for i18n

## Setup & Build
```bash
npm install
npm run dev
```

## Testing
```bash
npm run test
```

## Environment Variables
- Add your API base URL to `.env.local`:
```
NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com
```

## License
MIT
