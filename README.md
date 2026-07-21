# Personal Finance Tracker

A beginner-friendly full-stack app for recording income and expenses, viewing transaction history, and monitoring daily, weekly, and monthly spending goals.

## Technology

- React + Vite frontend
- Node.js + Express API
- PostgreSQL + Prisma ORM
- bcrypt password hashing and JWT authentication

## Project structure

```
client/       React frontend
server/       Express API and Prisma schema
```

## Setup

1. Install [Node.js](https://nodejs.org/) (version 18 or later) and PostgreSQL.
2. Create a PostgreSQL database named `personal_finance_tracker`.
3. Copy `.env.example` to `server/.env` and fill in `DATABASE_URL` and `JWT_SECRET`.

   Example `DATABASE_URL`:

   ```env
   DATABASE_URL="postgresql://postgres:your-password@localhost:5432/personal_finance_tracker?schema=public"
   JWT_SECRET="use-a-long-random-secret"
   ```

4. Install dependencies from the project root:

   ```bash
   npm install
   npm run install:all
   ```

5. Create the database tables and Prisma client:

   ```bash
   npm run prisma:migrate --prefix server -- --name init
   npm run prisma:generate --prefix server
   ```

6. Start both applications:

   ```bash
   npm run dev
   ```

Open `http://localhost:5173`. The API runs on `http://localhost:5000`.

## Windows executable

The app can be packaged as a Windows installer (`.exe`) using Electron. It still needs PostgreSQL. For the packaged app, set `DATABASE_URL` and `JWT_SECRET` as Windows environment variables before opening it (a local `server/.env` is used during development only).

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
