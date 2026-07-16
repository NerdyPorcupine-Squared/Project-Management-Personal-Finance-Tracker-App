# Product Backlog — Personal Finance Tracker (Locally Hosted Website)

Each item below = one Trello card in the **Product Backlog** list.
Card format: Title → card name | Story + Story Points + Priority → card description | Acceptance Criteria → checklist.

Estimation scale: Fibonacci story points (1, 2, 3, 5, 8).
Priority: P1 = Sprint 1 target, P2 = next, P3 = later.

---

## PBI-01: Project Setup & Environment — 2 pts — P1

**Story:** As a developer, I want the project structure, GitHub repo, and local web server set up so that the team can begin collaborative development.

**Acceptance Criteria:**
- [ ] GitHub repository created; all team members added as collaborators
- [ ] `main` branch holds stable code; feature-branch strategy documented in README
- [ ] Website runs locally (e.g., `localhost`) and serves a placeholder home page
- [ ] Trello board created with lists: Product Backlog, Sprint Backlog, In Progress, Testing/Review, Done

---

## PBI-02: User Registration — 3 pts — P1

**Story:** As a new user, I want to create an account with a username and password so that I can have my own secure finance tracker.

**Acceptance Criteria:**
- [ ] User can enter a username and password on a registration page
- [ ] Duplicate usernames are rejected with a clear error message
- [ ] Passwords are stored hashed, never in plain text
- [ ] Successful registration redirects the user to the login page

---

## PBI-03: User Login — 3 pts — P1

**Story:** As a user, I want to log into the application so that I can securely access my financial information.

**Acceptance Criteria:**
- [ ] User can enter a username and password on a login page
- [ ] Credentials are validated against stored accounts
- [ ] Appropriate success or error messages are displayed
- [ ] Successful login grants access to the application (protected pages)
- [ ] Unauthenticated users are redirected to the login page

---

## PBI-04: User Logout — 1 pt — P1

**Story:** As a logged-in user, I want to log out so that my financial data stays private on a shared computer.

**Acceptance Criteria:**
- [ ] Logout option is visible on every page while logged in
- [ ] Logging out ends the session and redirects to the login page
- [ ] Protected pages are inaccessible after logout

---

## PBI-05: Add Income — 3 pts — P2

**Story:** As a user, I want to record income entries (amount, source, date) so that I can track money coming in.

**Acceptance Criteria:**
- [ ] Form accepts amount, source/description, and date
- [ ] Amount must be a positive number; invalid input shows an error
- [ ] Saved income appears in the transaction history
- [ ] Entry is tied to the logged-in user's account

---

## PBI-06: Add Expense — 3 pts — P2

**Story:** As a user, I want to record expense entries (amount, category, date) so that I can track my spending.

**Acceptance Criteria:**
- [ ] Form accepts amount, category, description, and date
- [ ] Amount must be a positive number; invalid input shows an error
- [ ] Saved expense appears in the transaction history
- [ ] Entry is tied to the logged-in user's account

---

## PBI-07: View Transaction History — 3 pts — P2

**Story:** As a user, I want to view a history of my income and expenses so that I can review my financial activity.

**Acceptance Criteria:**
- [ ] All of the user's transactions display in one list, newest first
- [ ] Each row shows type (income/expense), amount, category/source, and date
- [ ] Income and expenses are visually distinct (e.g., color or sign)
- [ ] Empty state shows a helpful message when there are no transactions

---

## PBI-08: Edit & Delete Transactions — 2 pts — P3

**Story:** As a user, I want to edit or delete a transaction so that I can correct mistakes in my records.

**Acceptance Criteria:**
- [ ] Each transaction has edit and delete actions
- [ ] Edits are validated the same way as new entries
- [ ] Delete asks for confirmation before removing the record
- [ ] History updates immediately after either action

---

## PBI-09: Set Financial Goal — 3 pts — P3

**Story:** As a user, I want to set a spending goal (daily, weekly, or monthly limit) so that I can control my spending.

**Acceptance Criteria:**
- [ ] User can create a goal with an amount and a period (daily/weekly/monthly)
- [ ] Goal amount must be a positive number
- [ ] User can update or delete an existing goal
- [ ] Goals are tied to the logged-in user's account

---

## PBI-10: View Goal Progress — 3 pts — P3

**Story:** As a user, I want to see my spending compared against my goal so that I know whether I'm on track.

**Acceptance Criteria:**
- [ ] Current period spending is calculated from expense transactions
- [ ] Progress displays as spent vs. limit (e.g., "$45 of $100 weekly")
- [ ] Clear visual indicator when spending exceeds the goal
- [ ] Progress resets correctly at the start of each period

---

## PBI-11: Account Balance Summary — 2 pts — P3

**Story:** As a user, I want a summary of total income, total expenses, and net balance so that I can see my finances at a glance.

**Acceptance Criteria:**
- [ ] Summary shows total income, total expenses, and net balance for the user
- [ ] Totals update whenever transactions change
- [ ] Summary is visible on the main page after login

---

## Backlog Summary (Priority Order)

| # | Card Title | Points | Priority |
|---|-----------|--------|----------|
| PBI-01 | Project Setup & Environment | 2 | P1 — Sprint 1 |
| PBI-02 | User Registration | 3 | P1 — Sprint 1 |
| PBI-03 | User Login | 3 | P1 — Sprint 1 |
| PBI-04 | User Logout | 1 | P1 — Sprint 1 |
| PBI-05 | Add Income | 3 | P2 |
| PBI-06 | Add Expense | 3 | P2 |
| PBI-07 | View Transaction History | 3 | P2 |
| PBI-08 | Edit & Delete Transactions | 2 | P3 |
| PBI-09 | Set Financial Goal | 3 | P3 |
| PBI-10 | View Goal Progress | 3 | P3 |
| PBI-11 | Account Balance Summary | 2 | P3 |

**Total: 28 points** | Suggested Sprint 1 Backlog: PBI-01 through PBI-04 (9 points) — matches the required Sprint 1 increment: project setup + working authentication/login.
