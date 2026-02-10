# Stadtwerke Dashboard (Portfolio)

Portfolio-Webapp zur Abbildung zentraler Prozesse eines Versorgers (Geschäftspartner, Lokation/Messwesen, Verträge/Abrechnung, Service & Finance KPIs).

**Live Demo (Frontend):** https://stadtwerke-dashboard-cc.vercel.app  
**API Health (Backend):** https://stadtwerke-dashboard-cc.onrender.com/api/health

---

## Features

- **Geschäftspartner**: Liste + Detail (Stammdaten, Status, Tarif)
- **Lokation & Messwesen**: MaLo/MeLo-Logik, Zähler/Letzte Ablesung
- **Verträge & Abrechnung**: Vertragsliste + Detail (Abschlag, OPs, letzte Zahlung)
- **Service & Finance**: KPI-Übersicht + Case-Liste

---

## Tech Stack

- Frontend: Angular (TypeScript), HTML, SCSS
- Backend: Node.js, Express (REST API)
- DB: MySQL
- Deployment: Vercel (Frontend), Render (Backend), Railway (MySQL)

---

## Architektur (kurz)

Angular SPA ruft REST-Endpunkte unter `/api/*` auf. Lokal wird das via `proxy.conf.json` auf `http://localhost:3000` weitergeleitet; in Production rewritet Vercel `/api/*` auf das Render-Backend.

---

## Local Setup

### Voraussetzungen

- Node.js + npm
- MySQL (lokal) oder Railway-DB (remote)

### Backend starten

```bash
cd backend
npm install
# .env anlegen (siehe .env.example)
node server.js
```
