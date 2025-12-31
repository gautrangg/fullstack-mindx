Week 1 Submission Report - Full-Stack Application with OpenID Authentication
Student: Le Thanh Cong
Date: December 30, 2025
Project: MindX Full-Stack Application Deployment on Azure AKS

📋 Executive Summary
Successfully completed Week 1 objectives by deploying a production-ready full-stack application (Node.js API + React Frontend) on Azure Kubernetes Service (AKS) with OpenID Connect authentication, HTTPS/SSL, and proper ingress routing.
Key Achievements:

✅ Full-stack application deployed on Azure AKS
✅ OpenID authentication integrated with id-dev.mindx.edu.vn
✅ HTTPS enabled with valid SSL certificate
✅ Docker containerization with Azure Container Registry
✅ Kubernetes orchestration with ingress controller
✅ Complete authentication flow (Login/Logout)

Production URL: https://57.158.73.138.nip.io/

🏗️ Architecture Overview
Technology Stack

Backend: Node.js, Express, TypeScript
Frontend: React, TypeScript, Vite
Authentication: OpenID Connect (OAuth 2.0)
Container Registry: Azure Container Registry (ACR)
Orchestration: Azure Kubernetes Service (AKS)
Ingress: Nginx Ingress Controller
SSL/TLS: cert-manager with Let's Encrypt

System Architecture
Internet Users
      ↓
Custom Domain (HTTPS) - SSL Certificate
      ↓
Nginx Ingress Controller
      ├─→ /              → React Frontend (Port 8080)
      └─→ /auth/*        → Node.js API (Port 3000)
            ↓
      OpenID Provider (id-dev.mindx.edu.vn)

📦 Deliverables
1. Backend API
Location: backend/
Features:

RESTful API endpoints
OpenID Connect integration
JWT token validation
Session management
Health check endpoint

Key Endpoints:
GET  /health              - Health check
GET  /auth/login          - Get OpenID authorization URL
GET  /auth/callback       - Handle OAuth callback
GET  /auth/me             - Get current user info
POST /auth/logout         - User logout
GET  /data/user-data      - Protected data endpoint
Docker Image: conglt.azurecr.io/mindx-api:latest
2. Frontend Application
Location: frontend/
Features:

React SPA with TypeScript
Authentication UI (Login/Logout)
Protected routes
User session management
Error handling

Key Components:

AuthContext - Authentication state management
Navbar - User interface with login/logout
Home - Landing page
Dashboard - Protected page

Docker Image: conglt.azurecr.io/mindx-web:latest
3. Infrastructure as Code
Location: k8s/
Kubernetes Manifests:

backend-deployment.yaml - Backend deployment config
backend-service.yaml - Backend service (ClusterIP)
frontend-deployment.yaml - Frontend deployment config
frontend-service.yaml - Frontend service (ClusterIP)
api-ingress.yaml - API ingress routing
web-ingress.yaml - Frontend ingress routing
secrets.yaml - OpenID credentials (not in git)

4. Container Images
Azure Container Registry: conglt.azurecr.io

mindx-api:latest - Backend API (68.2 MB)
mindx-web:latest - Frontend app (50.7 MB)


🔐 Authentication Implementation
OpenID Connect Flow

User clicks "Login"

Frontend calls /auth/login
Backend returns OpenID authorization URL
Redirect to id-dev.mindx.edu.vn


User authenticates at MindX

User enters credentials
MindX validates and generates authorization code
Redirect back to callback_uri with code


Token Exchange

Backend receives authorization code
Exchanges code for access token (POST to /token)
Uses client_secret_basic authentication
Content-Type: application/x-www-form-urlencoded


User Info Retrieval

Backend fetches user info from /me endpoint
Returns token + user data to frontend
Frontend stores in localStorage


Session Management

Token stored in localStorage
Sent with API requests via Authorization header
Validated on protected endpoints



Security Measures

HTTPS enforced on all endpoints
Secrets managed via Kubernetes Secrets
Basic Authentication for OAuth token exchange
JWT token validation on protected routes
CORS properly configured


🚀 Deployment Process
Step-by-Step Deployment
1. Local Development & Testing
bash# Backend
cd backend
npm install
npm run dev          # http://localhost:3000

# Frontend
cd frontend
npm install
npm run dev          # http://localhost:5173
2. Containerization
bash# Build backend
cd backend
docker build -t mindx-api:latest .
docker tag mindx-api:latest conglt.azurecr.io/mindx-api:latest

# Build frontend
cd frontend
docker build -t mindx-web:latest .
docker tag mindx-web:latest conglt.azurecr.io/mindx-web:latest
3. Push to Azure Container Registry
bash# Login to ACR
az acr login --name conglt

# Push images
docker push conglt.azurecr.io/mindx-api:latest
docker push conglt.azurecr.io/mindx-web:latest
4. Configure Kubernetes Secrets
bashkubectl create secret generic openid-secrets \
  --from-literal=OPENID_CLIENT_ID=mindx-onboarding \
  --from-literal=OPENID_CLIENT_SECRET=<secret> \
  --from-literal=OPENID_PROVIDER=https://id-dev.mindx.edu.vn \
  --from-literal=CALLBACK_URI=https://57.158.73.138.nip.io/auth/callback \
  --from-literal=FRONTEND_URL=https://57.158.73.138.nip.io
5. Deploy to AKS
bash# Apply Kubernetes manifests
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/backend-service.yaml
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/frontend-service.yaml
kubectl apply -f k8s/api-ingress.yaml
kubectl apply -f k8s/web-ingress.yaml

# Verify deployment
kubectl get pods
kubectl get services
kubectl get ingress
6. SSL/TLS Configuration
bash# Install cert-manager (if not installed)
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml

# Certificate is auto-issued by cert-manager via Let's Encrypt
# Configured in ingress annotations

📊 Current Status
Production Environment

Status: ✅ Fully Operational
URL: https://57.158.73.138.nip.io/
SSL: ✅ Valid Certificate (Let's Encrypt)
Backend Pods: 1/1 Running
Frontend Pods: 1/1 Running
Authentication: ✅ Fully Working

Testing Results
Local Development (✅ Passed)

✅ Backend API responds correctly
✅ Frontend loads and renders
✅ Authentication flow works end-to-end
✅ Login/Logout functional
✅ User session persists
✅ Protected routes work

Production Deployment (✅ Completed)

✅ HTTPS endpoints accessible
✅ Health check passes
✅ Ingress routing works correctly
✅ Docker images deployed
✅ Authentication working end-to-end
✅ OpenID callback URI whitelisted
✅ Protected data endpoint functional
✅ Dashboard displays user info correctly


🔧 Configuration Details
Environment Variables (Backend)
```env
PORT=3000
OPENID_CLIENT_ID=mindx-onboarding
OPENID_CLIENT_SECRET=<base64-encoded-secret>
OPENID_PROVIDER=https://id-dev.mindx.edu.vn
CALLBACK_URI=https://57.158.73.138.nip.io/auth/callback
FRONTEND_URL=https://57.158.73.138.nip.io
```

Environment Variables (Frontend)
```env
VITE_API_BASE_URL=https://57.158.73.138.nip.io/api
```

OpenID Endpoints (from .well-known/openid-configuration)
```
Authorization: https://id-dev.mindx.edu.vn/auth
Token:         https://id-dev.mindx.edu.vn/token
UserInfo:      https://id-dev.mindx.edu.vn/me
JWKS:          https://id-dev.mindx.edu.vn/jwks
```

Kubernetes Resources
```
Namespace:  default
Cluster:    mindx-aks--mindx-intern-08--f244cd

Deployments:
- mindx-api  (1 replica)
- mindx-web  (1 replica)

Services:
- mindx-api-service  (ClusterIP, port 3000)
- mindx-web-service  (ClusterIP, port 8080)

Ingress Resources (3 separate ingresses):
- mindx-api-ingress   (path: /api(/|$)(.*) with rewrite)
- mindx-auth-ingress  (path: /auth without rewrite)
- mindx-web-ingress   (path: / without rewrite)

Secrets:
- openid-secrets  (5 keys)
- mindx-tls       (SSL certificate)
```

📈 Key Learnings
Technical Skills Acquired

Docker Containerization

Multi-stage builds for optimization
Layer caching strategies
Image tagging and versioning


Kubernetes Orchestration

Deployment configurations
Service discovery (ClusterIP)
Secret management
Resource limits and requests
Health checks (liveness/readiness probes)


Ingress & Networking

Nginx ingress controller
Path-based routing
SSL/TLS termination
HTTP to HTTPS redirect


OpenID/OAuth 2.0

Authorization Code flow
Token exchange
Basic Authentication for client credentials
JWT token management
Session handling


Azure Cloud Services

Azure Container Registry (ACR)
Azure Kubernetes Service (AKS)
Resource groups management
Azure CLI operations



Challenges Overcome

**1. dotenv loading in TypeScript**
- **Issue**: Environment variables not loading with ts-node
- **Solution**: Explicit path configuration with path.join()

**2. OpenID token exchange format**
- **Issue**: Invalid content-type (was sending JSON)
- **Solution**: Use application/x-www-form-urlencoded with URLSearchParams

**3. Client authentication method**
- **Issue**: Client credentials in request body rejected
- **Solution**: Use Basic Authentication header (RFC 6749 compliant)

**4. Backend API response structure mismatch**
- **Issue**: Backend returning `{data: "string", timestamp: Date}` but Dashboard expecting `{data: {id, title, description, features, lastLogin}}`
- **Solution**: Updated `/data/user-data` endpoint to return correct data structure matching Dashboard interface

**5. Frontend API base URL configuration**
- **Issue**: Production build using wrong API base URL (missing `/api` prefix)
- **Solution**: Updated `.env.production` to include `/api` path: `VITE_API_BASE_URL=https://57.158.73.138.nip.io/api`

**6. Ingress routing for OAuth callback**
- **Issue**: `/auth/callback` returning 404, router not found error
- **Solution**: Created separate ingress resource for `/auth` path without rewrite

**7. Ingress rewrite-target annotation conflict**
- **Issue**: MIME type error when loading JavaScript modules - `rewrite-target: /$2` was applying to all paths including frontend static assets
- **Solution**: Split into 3 separate ingress resources:
  - `mindx-api-ingress` - `/api/*` with rewrite
  - `mindx-auth-ingress` - `/auth` without rewrite
  - `mindx-web-ingress` - `/` without rewrite

**8. Vite environment variables not updating in Docker**
- **Issue**: Changes to `.env.production` not reflecting in deployed app
- **Root cause**: Vite embeds env vars at build time, not runtime
- **Solution**: Rebuild frontend image after every `.env.production` change




📚 Documentation
Repository Structure
fullstack-mindx/
├── backend/
│   ├── src/
│   │   ├── index.ts           # Main server
│   │   ├── routes/
│   │   │   ├── auth.ts        # Authentication routes
│   │   │   └── data.ts        # Protected data routes
│   │   └── middleware/
│   ├── Dockerfile
│   ├── .env                    # Environment variables
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── context/
│   │   │   └── AuthContext.tsx  # Auth state management
│   │   ├── components/
│   │   │   └── Navbar.tsx       # Navigation with auth UI
│   │   ├── pages/
│   │   │   ├── Home.tsx
│   │   │   └── Dashboard.tsx
│   │   └── utils/
│   │       └── api.ts           # API client
│   ├── Dockerfile
│   ├── package.json
│   └── vite.config.ts
│
└── k8s/
    ├── backend-deployment.yaml
    ├── backend-service.yaml
    ├── frontend-deployment.yaml
    ├── frontend-service.yaml
    ├── api-ingress.yaml
    └── web-ingress.yaml

Additional Documentation

README.md - Project overview and quick start
DEPLOYMENT.md - Detailed deployment guide
ARCHITECTURE.md - System architecture documentation
API.md - API endpoints documentation


✅ Acceptance Criteria Status
Based on Week 1 requirements:

**Backend API**
- ✅ Deployed and accessible via public HTTPS endpoint
- ✅ Running on Azure Cloud (AKS)
- ✅ Health check endpoint responding
- ✅ Protected data endpoint functional

**Frontend Web App**
- ✅ Deployed and accessible via public HTTPS domain
- ✅ Running on Azure Cloud (AKS)
- ✅ Communicates with backend via HTTPS
- ✅ UI loads correctly with all assets

**HTTPS Setup**
- ✅ HTTPS enforced for all endpoints
- ✅ Valid SSL certificate (Let's Encrypt)
- ✅ HTTP to HTTPS redirect configured

**Authentication (OpenID)**
- ✅ OpenID integration with id-dev.mindx.edu.vn
- ✅ Users can login via frontend
- ✅ Users can logout via frontend
- ✅ Production callback working (URI whitelisted)
- ✅ Protected routes require authentication
- ✅ Backend validates authentication tokens
- ✅ User session persists across page reloads
- ✅ Token stored securely in localStorage

**Infrastructure**
- ✅ All services running on Azure Cloud (AKS)
- ✅ Secrets managed securely (Kubernetes Secrets)
- ✅ Container images in Azure Container Registry
- ✅ Kubernetes manifests version controlled
- ✅ Multiple ingress resources for proper routing
- ✅ Resource limits and health checks configured

**Documentation**
- ✅ Setup instructions provided
- ✅ Deployment process documented
- ✅ Authentication flow explained
- ✅ Architecture diagrams included
- ✅ Troubleshooting guide with solutions


🎯 Next Steps

**Short Term (Week 2+)**
- Implement CI/CD pipeline (GitHub Actions/Azure DevOps)
- Add monitoring and logging (Prometheus + Grafana)
- Set up custom domain with proper DNS
- Implement database integration (PostgreSQL/MongoDB)
- Add more protected features and API endpoints

**Improvements & Optimizations**
- Add refresh token mechanism
- Implement token expiration handling
- Add user profile management features
- Enhance error handling with user-friendly messages
- Add loading states and skeleton screens
- Implement unit and integration tests
- Add rate limiting and request throttling
- Implement logging aggregation (ELK stack)


🙏 Acknowledgments

Mentor Support: Guidance on Azure infrastructure and OpenID configuration
MindX Identity Service: Provided OpenID Connect authentication
Azure Cloud: AKS cluster and container registry
Documentation: Week 1 tasks guide and architecture reference


📞 Contact & Support
For questions or issues regarding this deployment:

- Review logs: `kubectl logs <pod-name>`
- Check pod status: `kubectl get pods`
- Describe resources: `kubectl describe <resource-type> <resource-name>`
- Backend health: <https://57.158.73.138.nip.io/api/health>
- Test authentication: <https://57.158.73.138.nip.io/>

---

## 📝 Final Summary

**Submission Date**: December 30, 2025
**Status**: ✅ **Completed and Fully Functional**
**Completion**: **100%** - All Week 1 objectives achieved

### What Was Delivered

A production-ready full-stack application deployed on Azure Kubernetes Service with:

- ✅ Complete OpenID Connect authentication flow
- ✅ HTTPS with valid SSL certificate
- ✅ Containerized microservices architecture
- ✅ Proper ingress routing with path-based rules
- ✅ Protected API endpoints with JWT validation
- ✅ React SPA with authentication state management
- ✅ Comprehensive error handling and logging

### Production Readiness

All systems tested and verified in production:

- Authentication works end-to-end
- All API endpoints responding correctly
- Frontend assets loading properly
- SSL/TLS functioning correctly
- User sessions persisting correctly
- Protected routes enforcing authentication

**Live URL**: <https://57.158.73.138.nip.io/>

---

**Prepared by**: Le Thanh Cong
**Reviewed**: Ready for submission
**Project Status**: Production Ready ✅
