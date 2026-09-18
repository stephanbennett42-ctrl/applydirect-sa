# ApplyDirect SA — Subscription & Admin: How to Run

This page contains every command you need to run the **Subscription** page and the
**Admin** page in your own browser.

## What you have

```
sections/subscription/
├── backend/     Express API  (port 3002)
└── frontend/    Vue 3 + Vite (port 3004)

sections/admin/
├── backend/     Express API  (port 3003)
└── frontend/    Vue 3 + Vite (port 3005)
```

---

## 0. One-click start (fastest)

The launcher works on **Windows, macOS and Linux**.

| Option | Command |
|--------|---------|
| Windows | Double-click **`START-ALL.bat`** (or run `npm start`) |
| macOS / Linux | Run **`./START-ALL.sh`** (or `npm start`) |
| Stop everything | `STOP-ALL.bat` / `./STOP-ALL.sh` / `npm stop` |
| Start one module | `npm run start:sub` or `npm run start:admin` |

The launcher automatically:
1. Starts MySQL on port 3307 (XAMPP MariaDB on Windows) if it is not running.
2. Installs any missing npm dependencies (first run — needs internet).
3. Runs `db:setup` for both backends (safe, never deletes data).
4. Starts all 4 servers in the background (logs are written to the `logs/` folder).
5. Opens your browser on the student site; it is also reachable from phones/tablets on the same Wi-Fi via `http://<your-pc-ip>:3004` (admin: `:3005`).

To stop everything, run **`STOP-ALL.bat`** (Windows) / **`./STOP-ALL.sh`** (macOS, Linux) or `npm stop`.

(All the steps below are the manual versions of what the batch file does.)

---

## 1. Prerequisites (do once)

- Install **Node.js 18+** (https://nodejs.org)
- Install **XAMPP** — its MariaDB on port **3307** is used by this project
  (default XAMPP root password is blank).

---

## 2. Build the database (do once)

Open a terminal in each of the two backend folders and run:

### Subscription database
```powershell
cd sections/subscription/backend
npm install
npm run db:setup
```

### Admin database
```powershell
cd sections/admin/backend
npm install
npm run db:setup
```

`db:setup` creates the `uniapply` database, all tables, seeds the packages,
demo students, and the admin account. It is safe to re-run — it never deletes data.

---

## 3. Install the frontend packages (do once)

```powershell
cd sections/subscription/frontend
npm install
```

```powershell
cd sections/admin/frontend
npm install
```

---

## 4. Run everything (easy way — from the repo root)

```powershell
npm run start:sub   # starts Subscription API + site -> http://localhost:3004
npm run start:admin  # starts Admin API + site        -> http://localhost:3005
```

Or start everything at once with `npm start`. Both commands run the backend API
**and** the frontend together, and the browser opens automatically.

---

## 5. Run manually (one terminal per app)

### Subscription
```powershell
# Terminal 1 — API
cd sections/subscription/backend
npm run dev                 # API  -> http://localhost:3002

# Terminal 2 — frontend
cd sections/subscription/frontend
npm run dev                 # app  -> opens http://localhost:3004
```

### Admin
```powershell
# Terminal 1 — API
cd sections/admin/backend
npm run dev                 # API  -> http://localhost:3003

# Terminal 2 — frontend
cd sections/admin/frontend
npm run dev                 # app  -> opens http://localhost:3005
```

---

## 6. Demo logins

### Subscription page (http://localhost:3004)
| Role    | Email             | Password     |
|---------|-------------------|--------------|
| Student | thabo@email.com   | password123  |
| Student | zanele@email.com  | password123  |

Flow: **Home** (http://localhost:3004) → **Log In** (top right) or **Sign Up**
(/register) → choose a plan on **Payment Plans** → fill the form → **Pay** (simulated).

The **Admin Login** link is in the footer of every page — it opens
http://localhost:3005.

### Admin page (http://localhost:3005)
| Role  | Email                | Password |
|-------|----------------------|----------|
| Admin | admin@uniapply.co.za | admin123 |

---

## 7. Useful tips

- **Ports in use:** 3002 / 3003 (API) and 3004 / 3005 (frontends). If one is busy,
  edit `PORT` in the backend `.env` and `port` in the frontend `vite.config.js`.
- **Email / WhatsApp:** both backends run in "sandbox mode" out of the box —
  they log what would be sent instead of failing. To enable real email/WhatsApp,
  fill in the `SMTP_*` / `TWILIO_*` values in `sections/admin/backend/.env`.
- **Repair a broken setup:** just re-run `npm run db:setup` in each backend —
  tables are created with `IF NOT EXISTS` and seeds are skipped if data exists.