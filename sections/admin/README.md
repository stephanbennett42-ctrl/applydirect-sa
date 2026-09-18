# Admin Panel Section

Pages: AdminLogin, AdminDashboard.

## Folder structure

```
sections/admin/
├── backend/     <- Express API (own server, DB access, port 3003)
└── frontend/    <- Vue 3 + Vite app (own router, stores, views, port 3005)
```

## How to run

1. Start XAMPP MySQL (port 3307).
2. Set up the database (creates tables + seeds the admin account the first time):
   ```
   cd backend && npm install && npm run db:setup
   ```
3. Install frontend dependencies:
   ```
   cd ../frontend && npm install
   ```
4. Run (from repo root you can also use `npm run dev:admin`):
   ```
   cd backend   && npm run dev    # API on http://localhost:3003
   cd frontend  && npm run dev    # app on http://localhost:3005
   ```

## Demo admin account

| Role  | Email                | Password |
|-------|----------------------|----------|
| Admin | admin@uniapply.co.za | admin123 |

## Endpoints

- `POST /api/auth/login`, `GET /api/auth/me`
- `GET/POST /api/admin/users`, `PATCH /api/admin/users/:id`
- `GET/PATCH /api/admin/packages`
- `GET /api/admin/orders`
- `POST /api/admin/messages/whatsapp`