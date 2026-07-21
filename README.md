# Personal Finance Tracker

A beginner-friendly full-stack app for recording income and expenses, viewing transaction history, and monitoring daily, weekly, and monthly spending goals.

## Technology

- React + Vite frontend
- Node.js + Express API
- SQLite + Prisma ORM (a local database file)
- bcrypt password hashing and JWT authentication

## Project structure

```
client/       React frontend
server/       Express API and Prisma schema
```

## Setup

1. Install [Node.js](https://nodejs.org/) (version 18 or later).
2. Copy `.env.example` to `server/.env` and set `JWT_SECRET`.

   Example `DATABASE_URL`:

   ```env
   DATABASE_URL="file:./finance.db"
   JWT_SECRET="use-a-long-random-secret"
   ```

4. Install dependencies from the project root:

   ```bash
   npm install
   npm run install:all
   ```

5. Create the local database file, tables, and Prisma client:

   ```bash
   npm run db:create --prefix server
   npm run prisma:generate --prefix server
   ```

6. Start both applications:

   ```bash
   npm run dev
   ```

Open `http://localhost:5173`. The API runs on `http://localhost:5000`.

## Windows executable

The app can be packaged as a Windows installer (`.exe`) using Electron. It does not need Node.js, PostgreSQL, or a separate database server after it is packaged. On its first launch, the app copies an empty SQLite database to its private Windows app-data folder and saves all accounts, transactions, and goals there.

```bash
npm install
npm run install:all
npm run dist:win
```

The installer will be created in the `release/` folder. To preview the desktop window without packaging, run `npm run build` followed by `npm run desktop`.

## Features

- Register, log in, and log out
- Create, edit, view, and delete income and expense transactions
- Dashboard totals for income, expenses, balance, and recent transactions
- Create, edit, and delete daily, weekly, or monthly spending goals
- Goal progress based on expense transactions in the current period
- User-specific API routes protected with JWT authentication

## API routes

| Area | Routes |
| --- | --- |
| Authentication | `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me` |
| Transactions | `POST`, `GET /api/transactions`; `PUT`, `DELETE /api/transactions/:id` |
| Goals | `POST`, `GET /api/goals`; `PUT`, `DELETE /api/goals/:id` |

## Notes

Do not commit `server/.env`. It contains local database credentials and the JWT secret. The project uses a simple feature-branch workflow: make changes on a branch, test them locally, then merge reviewed work into `main`.
