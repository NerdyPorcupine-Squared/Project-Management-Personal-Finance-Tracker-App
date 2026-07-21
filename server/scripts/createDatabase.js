import fs from 'fs';
import path from 'path';
import initSqlJs from 'sql.js';
import { fileURLToPath } from 'url';

const folder = path.dirname(fileURLToPath(import.meta.url));
const databasePath = path.join(folder, '..', 'prisma', 'finance.db');
const SQL = await initSqlJs();
const database = new SQL.Database();

database.run(`
  PRAGMA foreign_keys = ON;
  CREATE TABLE "User" (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE "Transaction" (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    amount NUMERIC NOT NULL,
    type TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    date DATETIME NOT NULL,
    userId INTEGER NOT NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES "User"(id) ON DELETE CASCADE ON UPDATE CASCADE
  );
  CREATE TABLE "FinancialGoal" (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    period TEXT NOT NULL,
    userId INTEGER NOT NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES "User"(id) ON DELETE CASCADE ON UPDATE CASCADE
  );
`);

fs.writeFileSync(databasePath, Buffer.from(database.export()));
database.close();
console.log(`Created local database template at ${databasePath}`);
