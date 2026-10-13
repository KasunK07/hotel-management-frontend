# Meridian Restaurant Management

React/Vite administration frontend for the active Go/Gin backend at `../../backend`. The `backend.ori` directory is not used.

## Local setup

1. Start PostgreSQL on port `5433` and set `DB_ADDR` for the active backend.
2. In `../../backend`, load `.envrc`, then run `PGPORT=5433 make migrate-up` and `PGPORT=5433 go run ./cmd/api`.
3. Here, run `npm install` and `npm run dev`.

Vite proxies `/api` to `http://127.0.0.1:8080`. Set `VITE_API_PROXY_TARGET` if the Go API runs elsewhere. For deployment, route `/api` to the Go service on the same origin as the frontend.

Registration, email verification, password setup, login, restaurant and menu management, tables and QR codes, orders, kitchen status, employee records, restaurant settings, opening hours, and analytics use the backend. Run all database migrations before starting the API. The backend needs `FRONTEND_URL` to generate email links. Configure `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, and `SMTP_FROM` to deliver mail. Development mode returns a verification URL in the registration response so the flow can be tried without SMTP; production requires SMTP configuration.

The dashboard and analytics use stored orders and restaurants. Table QR codes resolve to a public table-verification page. Guest ordering and employee sign-in/invitations are separate from this administration app; the employee screen stores team-directory records only.

Checks: `npm run build` here and `go test ./...` in `../../backend`.
