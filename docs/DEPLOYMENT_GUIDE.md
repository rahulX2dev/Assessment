# Deployment Guide

## 1. Prerequisites

| Tool | Version | Needed for |
|---|---|---|
| Node.js | 20+ (22 tested) | Frontend, API gateway |
| Java JDK | 17 | Core service |
| Maven | 3.9+ | Core service build |
| Python | 3.11+ (3.12 in images) | AI service |
| GCC / Clang / MSVC | C11 and C++17 | Native engines |
| Docker | 24+ with Compose v2 | Container stack |
| kubectl + Helm | 1.28+ | Kubernetes rollout |

MySQL, PostgreSQL and Redis are provided by Docker Compose; nothing needs to be
installed locally to run the stack.

## 2. Fastest path — whole stack in Docker

```bash
git clone <repository-url> hubflow
cd hubflow/deployment

cp .env.example .env          # then edit the secrets
docker compose up -d --build
docker compose ps
```

| URL | What |
|---|---|
| `http://localhost` | Frontend through Nginx |
| `http://localhost:8080/api/health` | Gateway health |
| `http://localhost:8081/swagger-ui.html` | Core service API reference |
| `http://localhost:8000/docs` | AI service API reference |

Database schemas load automatically: `database/mysql/*.sql` and
`database/postgres/*.sql` are mounted into each container's init directory and run
in filename order on first boot.

Tear down with `docker compose down`, or `docker compose down -v` to drop volumes.

## 3. Running services individually

### Frontend

```bash
cd frontend
npm install
npm run dev        # http://localhost:5173
npm run build      # production bundle into dist/
npm run preview
```

`frontend/.env` ships with working defaults, so no setup step is needed. Vite
proxies `/api` and `/ws` to `DEV_PROXY_TARGET` (default `http://localhost:8080`), so
the gateway can run separately. Point the frontend at a different backend by editing
`.env` or exporting the variable, which takes precedence over the file:

```bash
VITE_GATEWAY_URL=https://staging.hubflow.io/api npm run build
```

### API gateway

```bash
cd backend/api-gateway
npm install
cp .env.example .env
npm run dev        # http://localhost:8080
```

Redis is optional. Without `REDIS_URL` the rate limiter logs a warning and uses an
in-process store.

### Core service

```bash
cd backend/core-service
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

The `dev` profile uses in-memory H2 with `create-drop` and seeds the plan
catalogue, so no MySQL is required. For MySQL:

```bash
export SPRING_PROFILES_ACTIVE=prod
export MYSQL_HOST=localhost MYSQL_USER=hubflow MYSQL_PASSWORD=...
mvn spring-boot:run
```

Flyway applies `classpath:db/migration` on startup in the `prod` profile.

### AI service

```bash
cd backend/ai-service
python -m venv .venv
.venv/bin/activate            # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload --port 8000
```

PostgreSQL is optional. Without it the analytics endpoint returns a modelled series
after a 2-second connect timeout, then suppresses retries for 30 seconds.

### Native engines

```bash
cd backend/engine-cpp && make all
./bin/hubflow_engine --input ../../samples/contacts.csv --out reports \
  --campaign cmp_demo --format txt --workers 4

cd ../fileops-c && make all
./bin/hubflow_fileops report --input ../../samples/delivery_report.csv --campaign cmp_demo
./bin/hubflow_fileops stats --input ../../samples/contacts.csv
```

On Windows with Visual Studio installed, run `build.bat` in each directory instead.

`make debug` builds with AddressSanitizer and UBSan. `make memcheck` in
`fileops-c` runs the binary under Valgrind and fails on any definite leak; CI runs
this on every push.

## 4. Environment variables

### Frontend

| Variable | Default | Notes |
|---|---|---|
| `VITE_GATEWAY_URL` | `/api` | Gateway base URL. Relative by default so Nginx can proxy it |
| `VITE_STORE_API_URL` | `https://fakestoreapi.com` | Product catalogue for the e-commerce page |
| `VITE_API_TIMEOUT` | 12000 | Default request timeout in ms |
| `VITE_GATEWAY_TIMEOUT` | 6000 | Shorter timeout for gateway calls so pricing falls back quickly |
| `DEV_SERVER_PORT` | 5173 | Vite dev server port |
| `DEV_PROXY_TARGET` | `http://localhost:8080` | Dev proxy target for `/api` and `/ws` |

Only `VITE_`-prefixed variables reach the browser. They are inlined into the bundle
at build time, so they are public by definition — never put a secret in one. This is
why `frontend/.env` is committed while every backend `.env` is git-ignored.

Because they are baked in at build time, changing them requires a rebuild. The
frontend image accepts them as build arguments:

```bash
docker build -f deployment/docker/Dockerfile.frontend \
  --build-arg VITE_GATEWAY_URL=https://app.hubflow.io/api \
  -t hubflow-frontend:1.0.0 .
```

Compose passes them through from `deployment/.env`. `DEV_SERVER_PORT` and
`DEV_PROXY_TARGET` are unprefixed because they are read by `vite.config.js` through
`loadEnv` and never leave the build machine.

### Gateway

| Variable | Default | Notes |
|---|---|---|
| `PORT` | 8080 | |
| `JWT_SECRET` | dev placeholder | Must match the core service; 32+ chars |
| `JWT_ISSUER` | `hubflow-core` | Must match the token issuer |
| `INTERNAL_SERVICE_TOKEN` | dev placeholder | Guards internal endpoints |
| `CORE_SERVICE_URL` | `http://localhost:8081` | |
| `AI_SERVICE_URL` | `http://localhost:8000` | |
| `REDIS_URL` | empty | Empty falls back to in-memory limiting |
| `CORS_ORIGINS` | `http://localhost:5173` | Comma separated |
| `RATE_LIMIT_MAX` | 120 | Per window, per tenant/user |
| `UPLOAD_MAX_BYTES` | 10485760 | 10 MB |

### Core service

| Variable | Default | Notes |
|---|---|---|
| `SPRING_PROFILES_ACTIVE` | `dev` | `dev` uses H2, `prod` uses MySQL |
| `SERVER_PORT` | 8081 | |
| `JWT_SECRET` | dev placeholder | Shared with the gateway |
| `ACCESS_TOKEN_MINUTES` | 15 | |
| `REFRESH_TOKEN_DAYS` | 30 | |
| `MYSQL_HOST` / `MYSQL_PORT` / `MYSQL_DATABASE` | mysql / 3306 / hubflow | |
| `MYSQL_USER` / `MYSQL_PASSWORD` | | Required in `prod` |
| `WHATSAPP_ENABLED` | false | When false, sends are simulated |
| `WHATSAPP_PHONE_NUMBER_ID` | | From Meta Business Manager |
| `WHATSAPP_ACCESS_TOKEN` | | Permanent system-user token |
| `WHATSAPP_VERIFY_TOKEN` | | Must match the value entered in Meta |
| `OTP_EXPOSE_CODE` | false | Dev only; never enable in production |

### AI service

| Variable | Default | Notes |
|---|---|---|
| `PORT` | 8000 | |
| `POSTGRES_DSN` | local dsn | SQLAlchemy + psycopg URL |
| `REDIS_URL` | `redis://localhost:6379/1` | |
| `SCHEDULER_ENABLED` | true | Set false on API replicas, true on exactly one worker |
| `JWT_SECRET` / `JWT_ISSUER` | | Must match the core service |

**Never reuse the placeholder secrets.** Generate with:

```bash
openssl rand -base64 48
```

## 5. WhatsApp Business API setup

1. Create a Meta Business account and add the WhatsApp product.
2. Add and verify the sending phone number; note its **Phone Number ID**.
3. Create a system user with `whatsapp_business_messaging` and
   `whatsapp_business_management`, then generate a permanent token.
4. Set `WHATSAPP_ENABLED=true` plus the three WhatsApp variables.
5. Point the webhook at `https://<host>/api/v1/webhooks/whatsapp` and enter the
   same `WHATSAPP_VERIFY_TOKEN`. Subscribe to the `messages` field.
6. Submit templates through `POST /v1/campaigns/templates`; record Meta's decision
   with the approval endpoint.

Until step 4, sends are simulated and return `wamid.simulated.*` ids, so the whole
flow is testable without a Meta account.

## 6. Kubernetes

```bash
kubectl apply -f deployment/k8s/00-namespace-config.yaml
kubectl apply -f deployment/k8s/
kubectl -n hubflow get pods -w
```

Manifests include:

| File | Contents |
|---|---|
| `00-namespace-config.yaml` | Namespace, ConfigMap, Secret template, ResourceQuota |
| `01-gateway.yaml` | Deployment, Service, HPA 3-12, PDB, uploads PVC |
| `02-core-service.yaml` | Deployment with startup/liveness/readiness probes, HPA 3-10, PDB |
| `03-ai-service.yaml` | API Deployment plus a single-replica scheduler Deployment |
| `04-frontend-ingress.yaml` | Frontend, Ingress with TLS, NetworkPolicy |
| `05-engine-jobs.yaml` | CronJobs for the C++ engine and C report roller |

Replace the placeholder Secret with real values before applying. In production use
the External Secrets Operator against AWS Secrets Manager rather than committing
any secret material:

```bash
kubectl -n hubflow create secret generic hubflow-secrets \
  --from-literal=JWT_SECRET="$(openssl rand -base64 48)" \
  --from-literal=INTERNAL_SERVICE_TOKEN="$(openssl rand -base64 32)" \
  --from-literal=MYSQL_PASSWORD='...' \
  --dry-run=client -o yaml | kubectl apply -f -
```

The scheduler runs as its own single-replica Deployment with
`SCHEDULER_ENABLED=true` while API replicas set it to `false`. This is deliberate:
running APScheduler on every replica would fire each job N times.

## 7. AWS topology

```
Route 53
   |
CloudFront (static assets, TLS termination at the edge)
   |
Application Load Balancer  --> AWS WAF
   |
EKS (ap-south-1, three AZs)
   ├── ingress-nginx
   ├── frontend        x2
   ├── api-gateway     x3-12   (HPA)
   ├── core-service    x3-10   (HPA)
   ├── ai-service      x2-8    (HPA)
   ├── ai-scheduler    x1
   └── engine CronJobs
   |
   ├── RDS MySQL 8 (Multi-AZ, one read replica)
   ├── RDS PostgreSQL 16 (Multi-AZ)
   ├── ElastiCache Redis (cluster mode, two shards)
   ├── EFS  (shared uploads and reports)
   ├── S3   (archived CSVs and generated reports, lifecycle to Glacier at 90 days)
   └── Secrets Manager (rotated credentials)
```

Sizing for roughly 3,200 tenants: `db.r6g.xlarge` for MySQL, `db.r6g.large` for
PostgreSQL, `cache.r6g.large` Redis nodes, `m6i.xlarge` EKS nodes with cluster
autoscaler between 3 and 12.

## 8. CI/CD

`.github/workflows/ci.yml` runs on every push and pull request:

1. Frontend `npm ci` and production build, bundle uploaded as an artifact.
2. Gateway `npm ci`, `npm audit --audit-level=high`, `node --check` on every module,
   then a boot smoke test hitting `/api/health` and `/api/v1/billing/plans`.
3. Core service `mvn clean verify`, jar uploaded.
4. AI service dependency install, app construction check, and four intent
   assertions that fail the build if the classifier regresses.
5. Native engines built with `make`, run against the sample CSVs, and checked under
   Valgrind with `--error-exitcode=1` on definite leaks.
6. All five container images built once the above pass.

`.github/workflows/cd.yml` runs on `v*.*.*` tags:

1. Builds and pushes all five images to GHCR with semver and short-SHA tags.
2. Scans each image with Trivy and fails on CRITICAL or HIGH.
3. Assumes an AWS role via OIDC, updates kubeconfig, applies manifests.
4. Sets the released tag on each deployment and waits for rollout.
5. Verifies `/api/health` through the ingress, and rolls back every deployment on
   failure.

Required repository secrets: `AWS_DEPLOY_ROLE_ARN`. `GITHUB_TOKEN` is provided
automatically.

## 9. Rollback

```bash
kubectl -n hubflow rollout undo deployment/core-service
kubectl -n hubflow rollout undo deployment/core-service --to-revision=3
kubectl -n hubflow rollout history deployment/core-service
```

Rolling updates use `maxUnavailable: 0`, so a failed new pod never removes healthy
capacity. Database migrations must stay backward compatible for one release —
add columns, do not rename or drop until the previous version is fully retired.

## 10. Verification checklist

```bash
curl -fsS http://localhost:8080/api/health
curl -fsS http://localhost:8080/api/health/ready      # upstreams + circuit state
curl -fsS http://localhost:8080/api/v1/billing/plans
curl -fsS http://localhost:8000/health

curl -X POST http://localhost:8080/api/v1/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"fullName":"Test User","email":"test@example.com","phone":"+919812345678","password":"StrongPassw0rd!","companyName":"Test Co"}'
```

Import `postman/hubflow-collection.json`; it chains registration through campaign
dispatch and captures tokens automatically.

## 11. Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| Gateway returns 502 `UPSTREAM_ERROR` | Core service unreachable | Check `docker compose logs core-service`; the breaker opens after 5 failures and retries after 15s |
| 401 `UNAUTHORIZED` on valid credentials | `JWT_SECRET` or `JWT_ISSUER` mismatch | All three services must share both values |
| Analytics shows `source_is_live: 0` | PostgreSQL unreachable | Expected fallback; check the DSN and that the schema ran |
| Rate limiter warns about in-memory store | `REDIS_URL` unset | Fine locally; set it in production or limits are per-pod |
| Core service fails on `Table not found` | Seed ran before schema creation | `dev` profile needs `spring.jpa.defer-datasource-initialization: true` (already set) |
| Scheduled jobs fire multiple times | Scheduler enabled on several replicas | Only the `ai-scheduler` deployment sets `SCHEDULER_ENABLED=true` |
| Native binary blocked on Windows | Smart App Control / Device Guard blocks unsigned executables | Build and run inside Docker, or sign the binary |
