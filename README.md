# Fitness Dashboard

![Fitness Dashboard preview](public/preview.svg)

A demo dashboard for personal trainers to track students, workouts, and physical progress. Built as a portfolio piece: fully client-side, no backend, no accounts, and no real data.

## Features

- Overview metrics: active students, workouts scheduled today, weekly attendance rate, and average evolution
- Weekly calendar showing scheduled workouts per day
- Student list with generated-initials avatars, goal, status, and last activity
- Search by name and filter by goal (hypertrophy, weight loss, conditioning, mobility)
- Create, edit, and remove students
- Student detail view with height, current weight, evolution percentage, and a weight history chart (plain SVG, no external chart library)
- Create and edit workouts with exercises (sets, reps, load, notes)
- Mark workouts as completed directly from the workout history list
- Well-designed empty states for no students / no matching results / no workouts
- Light and dark theme, persisted and applied before first paint
- Fully responsive layout, from mobile to desktop
- Accessible modals: focus trap, `Escape` to close, focus restored on close, `:focus-visible` outlines

## Tech Stack

- [Next.js](https://nextjs.org) (App Router)
- [React](https://react.dev)
- [TypeScript](https://www.typescriptlang.org)
- [Tailwind CSS v4](https://tailwindcss.com)
- [lucide-react](https://lucide.dev) for icons

## Data & Storage

All data (students, workouts, theme preference) is fictional seed data generated on first load and persisted in the browser's `localStorage`. There is no database, no authentication, and no external API calls. Clearing `localStorage` for this site resets the app back to the seeded demo data.

## Getting Started

Install dependencies and run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Available Scripts

- `npm run dev`: start the development server
- `npm run build`: create a production build
- `npm run start`: run the production build
- `npm run lint`: run ESLint

## Project Structure

```
src/
  app/            App Router entry point, global styles, root layout
  components/     UI components (cards, modals, charts, dashboard widgets)
  hooks/          Client hooks for students, workouts, theme, toasts, modal a11y
  lib/            Types, localStorage persistence, seed data, metrics, date utils
public/
  preview.svg     Dashboard preview image used in this README
```

## Notes

- All students, names, and workout data are fictional and generated at runtime; nothing represents a real person, gym, or brand.

## License

Licensed under the [MIT License](LICENSE).
