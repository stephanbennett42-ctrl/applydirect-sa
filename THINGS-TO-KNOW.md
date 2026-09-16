# ApplyDirect SA Login Module

This branch contains only the login work: its Vue frontend and Express/MySQL backend.

## Project structure

```text
sections/login/
├── backend/     Express API on port 3006
└── frontend/    Vue 3 + Vite on port 3007
```

Admin and subscription files are not included in this branch.

## Prerequisites

- Node.js 18 or newer
- XAMPP MariaDB/MySQL running on port 3307
- A blank local MySQL root password, or matching values in `sections/login/backend/.env`

## One-click start

Run `START-ALL.bat` from the repository root. It will:

1. Start XAMPP MySQL on port 3307 if it is not already running.
2. Install login backend and frontend dependencies when needed.
3. Create the `uniapply` database and `users` table, then add demo accounts if empty.
4. Start the login API and frontend.
5. Open `http://localhost:3007`.

Run `STOP-ALL.bat` to stop the login API and frontend. MySQL is left running.

## Manual commands

```powershell
cd sections/login/backend
npm install
npm run db:setup
npm run dev
```

In a second terminal:

```powershell
cd sections/login/frontend
npm install
npm run dev
```

The frontend is available at `http://localhost:3007` and the API health check is
available at `http://localhost:3006/api/health`.

## Demo accounts

| Role | Email | Password |
|---|---|---|
| Student | `thabo@email.com` | `password123` |
| Student | `zanele@email.com` | `password123` |
| Admin | `admin@uniapply.co.za` | `admin123` |

User records are stored in the MySQL table `uniapply.users`.
