# MeetSpace

Full-stack platform for booking meeting rooms and managing their equipment, with Microsoft Entra ID (Azure AD) single sign-on and a complete CI/CD pipeline to Kubernetes.

![Java](https://img.shields.io/badge/Java-17-orange) ![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2-6db33f) ![Next.js](https://img.shields.io/badge/Next.js-16-black) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791) ![Kubernetes](https://img.shields.io/badge/Kubernetes-ArgoCD-326ce5)

## Features

- **Microsoft SSO**: users sign in with their Microsoft account (MSAL on the frontend, JWT resource server on the backend).
- **Interactive floor plan**: rooms are pinned on a floor plan and can be repositioned by drag and drop.
- **Room booking**: reservations with overlap detection, plus confirmation and cancellation.
- **Equipment inventory**: equipment is assigned to rooms, and users can report broken items to a helpdesk.
- **User administration**: creating a user also provisions their Azure AD account through Microsoft Graph, with a strong temporary password.
- **QR codes**: each room has a downloadable QR code linking to its booking page.

## Architecture

```
┌──────────────┐   OAuth2 / OIDC   ┌─────────────────────┐
│  Next.js UI  │ ────────────────▶ │ Microsoft Entra ID  │
│  (MSAL)      │                   └─────────▲───────────┘
└──────┬───────┘                             │ Graph API
       │ REST + JWT                          │
┌──────▼───────────────┐   JPA    ┌──────────┴──┐
│ Spring Boot API      │ ───────▶ │ PostgreSQL  │
│ (resource server)    │          └─────────────┘
└──────────────────────┘
```

| Layer    | Stack |
|----------|-------|
| Frontend | Next.js 16 (App Router), React 19, TypeScript, Redux Toolkit, Tailwind CSS, MUI, i18next |
| Backend  | Spring Boot 3, Spring Security (OAuth2 resource server), Spring Data JPA, MapStruct, Lombok, Microsoft Graph SDK |
| Data     | PostgreSQL 15 (H2 in tests) |
| DevOps   | Docker multi-stage builds, Jenkins (Kubernetes agents), SonarQube, container registry, Kubernetes, ArgoCD |

## Project structure

```
code/
  backend/     Spring Boot API (controllers → services → repositories, DTOs + MapStruct mappers)
  frontend/    Next.js app (Redux slices per domain, MSAL auth provider)
infra/
  java/        Backend Dockerfile
  nodejs/      Frontend Dockerfile
  k8s/         Kubernetes manifests (deployments, services, PostgreSQL + PVC)
  argocd/      ArgoCD Application (GitOps sync of infra/k8s)
Jenkinsfile    CI/CD pipeline
```

## Getting started

### Prerequisites

- Docker and Docker Compose
- An Azure AD tenant with two app registrations:
  - **Backend** (confidential client) with the Microsoft Graph application permission `User.ReadWrite.All`
  - **Frontend** (SPA) with the redirect URI `http://localhost:3000`

### Run with Docker Compose

```bash
cp .env.example .env    # then fill in your own values
docker compose up --build
```

- Frontend: http://localhost:3000
- API: http://localhost:8080

### Run for development

```bash
# Backend (Java 17)
cd code/backend
export AZURE_TENANT_ID=... AZURE_CLIENT_ID=... AZURE_CLIENT_SECRET=... AZURE_TENANT_DOMAIN=...
./mvnw spring-boot:run

# Frontend (Node 20+)
cd code/frontend
cp .env.example .env.local   # then fill in
npm install
npm run dev
```

### Tests

```bash
cd code/backend && ./mvnw test   # uses in-memory H2, no Azure credentials needed
cd code/frontend && npm run lint && npx tsc --noEmit
```

## Configuration

Configuration comes only from environment variables. The repository contains no secrets: see [`.env.example`](.env.example) and [`code/frontend/.env.example`](code/frontend/.env.example).

| Variable | Used by | Description |
|----------|---------|-------------|
| `SPRING_DATASOURCE_URL` / `_USERNAME` / `_PASSWORD` | backend | PostgreSQL connection |
| `AZURE_TENANT_ID`, `AZURE_CLIENT_ID`, `AZURE_CLIENT_SECRET` | backend | Token validation and Microsoft Graph access |
| `AZURE_TENANT_DOMAIN` | backend + frontend | Domain for new users' usernames |
| `APP_CORS_ALLOWED_ORIGINS` | backend | Comma-separated allowed origins |
| `NEXT_PUBLIC_API_URL` | frontend | Backend base URL |
| `NEXT_PUBLIC_MSAL_CLIENT_ID`, `NEXT_PUBLIC_MSAL_AUTHORITY`, `NEXT_PUBLIC_MSAL_REDIRECT_URI` | frontend | MSAL settings |
| `NEXT_PUBLIC_SUPPORT_TICKET_URL` | frontend | Optional helpdesk URL (falls back to e-mail) |
| `NEXT_PUBLIC_FLOOR_PLAN_URL` | frontend | Optional custom floor-plan image |

`NEXT_PUBLIC_*` values are inlined at build time, so they are passed to the frontend image as Docker build args.

## CI/CD

The `Jenkinsfile` runs on Kubernetes pod agents:

1. **Backend build and test**: `mvn verify`, with JUnit reports published
2. **Frontend lint and type-check**: ESLint and `tsc --noEmit`
3. **SonarQube analysis**
4. **Docker build**: multi-stage images that run as a non-root user
5. **Push** to the container registry
6. **Deploy**: rolling update on Kubernetes (`main` branch only)

ArgoCD also keeps the cluster in sync with `infra/k8s` (GitOps). Kubernetes secrets are created out of band; see [`infra/k8s/secrets.example.yaml`](infra/k8s/secrets.example.yaml).

## Roadmap

- Role-based authorization on admin endpoints (`@PreAuthorize`)
- Actuator health endpoints for Kubernetes probes
- Unit tests for the booking and overlap rules
- E-mail notifications for reservation confirmations
