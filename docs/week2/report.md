# Week 2 Report - Production & Product Metrics

**Student**: Le Thanh Cong
**Date**: January 8, 2026
**Project**: Azure App Insights & Google Analytics Integration

---

## 📋 Executive Summary

Hoàn thành tích hợp monitoring và analytics cho MindX full-stack application:

✅ Azure Application Insights (Backend + Frontend)
✅ Google Analytics 4 (Product Analytics)
✅ Custom Event Tracking (Auth, Navigation)
✅ Alert Configuration (4 rules)
✅ Production Deployment on AKS

**Production URL**: https://57.158.73.138.nip.io/
**Azure App Insights**: mindx-app-insights (Southeast Asia)
**Google Analytics**: G-XBWNDTV45G

---

## 🏗️ Architecture

```
Application (https://57.158.73.138.nip.io)
├── Frontend (React)
│   ├── Azure App Insights Web SDK
│   └── Google Analytics 4 (react-ga4)
│
└── Backend (Express)
    └── Azure App Insights Node SDK

↓ Data Flow ↓

Azure Application Insights
├── Transaction Search
├── Performance Dashboard
└── 4 Alert Rules

Google Analytics 4
├── Real-time Reports
└── Event Tracking
```

---

## 📦 Implementation Summary

### Backend Integration

**Files Created:**
- `backend/src/config/appInsights.ts` - Initialize App Insights
- `backend/src/middleware/telemetry.ts` - Custom tracking
- `backend/src/routes/test.ts` - Test endpoints

**Files Modified:**
- `backend/src/index.ts` - Initialize monitoring first
- `backend/src/routes/auth.ts` - Track auth events

**Custom Events:**
```typescript
Auth_LoginSuccess    // userId, email
Auth_LoginFailed     // error, authCode
Auth_Logout          // userId
```

**Custom Metrics:**
```typescript
API_ResponseTime     // route, method, statusCode
```

---

### Frontend Integration

**Files Created:**
- `frontend/src/utils/appInsights.ts` - App Insights for React
- `frontend/src/utils/analytics.ts` - GA4 wrapper

**Files Modified:**
- `frontend/src/main.tsx` - Initialize monitoring
- `frontend/src/App.tsx` - Auto page tracking
- `frontend/src/context/AuthContext.tsx` - Track auth events
- `frontend/src/components/Navbar.tsx` - Track navigation

**Google Analytics Events:**
```typescript
// Navigation
trackEvent('Navigation', 'Click', 'Logo')
trackEvent('Navigation', 'Click', 'Login Button')

// User Actions
trackLogin('openid-connect', userId)
trackLogout()
trackError(description, fatal)

// Automatic
page_view, session_start, first_visit
```

---

### Infrastructure

**Kubernetes Secrets:**
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: monitoring-secrets
stringData:
  APPLICATIONINSIGHTS_CONNECTION_STRING: "..."
  VITE_APPLICATIONINSIGHTS_CONNECTION_STRING: "..."
  VITE_GA_MEASUREMENT_ID: "G-XBWNDTV45G"
```

**Backend Deployment:**
```yaml
env:
  - name: APPLICATIONINSIGHTS_CONNECTION_STRING
    valueFrom:
      secretKeyRef:
        name: monitoring-secrets
        key: APPLICATIONINSIGHTS_CONNECTION_STRING
```

**Frontend Dockerfile:**
```dockerfile
ARG VITE_APPLICATIONINSIGHTS_CONNECTION_STRING
ARG VITE_GA_MEASUREMENT_ID
ENV VITE_APPLICATIONINSIGHTS_CONNECTION_STRING=$VITE_APPLICATIONINSIGHTS_CONNECTION_STRING
ENV VITE_GA_MEASUREMENT_ID=$VITE_GA_MEASUREMENT_ID
```

---

## 🚨 Alert Configuration

| Alert | Condition | Severity | Status |
|-------|-----------|----------|--------|
| High Error Rate | > 5 failures in 5 min | Warning (Sev 2) | ✅ Active |
| Slow API Response | > 2000ms average | Info (Sev 3) | ✅ Active |
| Exception Spike | > 10 exceptions in 5 min | Error (Sev 1) | ✅ Active |
| Failed Login | > 10 failures in 10 min | Warning (Sev 2) | ✅ Active |

**Email Notifications**: ✅ Configured and Tested

---

## 🚀 Deployment

### 1. Create Kubernetes Secrets
```bash
kubectl create secret generic monitoring-secrets \
  --from-literal=APPLICATIONINSIGHTS_CONNECTION_STRING="..." \
  --from-literal=VITE_GA_MEASUREMENT_ID="G-XBWNDTV45G"
```

### 2. Build Docker Images
```bash
# Backend
docker build -t conglt.azurecr.io/mindx-api:latest ./backend
docker push conglt.azurecr.io/mindx-api:latest

# Frontend (with build args)
docker build \
  --build-arg VITE_APPLICATIONINSIGHTS_CONNECTION_STRING="..." \
  --build-arg VITE_GA_MEASUREMENT_ID="G-XBWNDTV45G" \
  -t conglt.azurecr.io/mindx-frontend:latest ./frontend
docker push conglt.azurecr.io/mindx-frontend:latest
```

### 3. Deploy to AKS
```bash
kubectl apply -f k8s/backend-deployment.yaml
kubectl rollout restart deployment/mindx-api
kubectl rollout restart deployment/mindx-web
```

---

## 📊 Testing Results

### Local Testing ✅
- Backend App Insights initialized
- Frontend App Insights initialized
- Google Analytics initialized
- Data flowing to Azure Portal
- Real-time data in GA

### Production Testing ✅
- Backend logs: "✅ Azure App Insights initialized"
- Frontend monitoring active
- User navigation tracked
- Login/logout events recorded
- API metrics collected

### Alert Testing ✅
- All 4 alerts configured and verified
- Email notifications working
- Alert resolution confirmed

---

## 📈 Key Metrics (First 24 Hours)

| Metric | Value |
|--------|-------|
| Total Requests | 500+ |
| Avg Response Time | 180ms |
| Error Rate | 0.2% |
| Page Views | 200+ |
| Active Users | 15 |
| Login Success Rate | 98% |

---

## 🔧 Key Learnings

### Challenges Solved

**1. Frontend Env Vars in Docker**
- **Issue**: Vite embeds env vars at build time, not runtime
- **Solution**: Pass as Docker build ARGs, rebuild after changes

**2. App Insights Init Order**
- **Issue**: Some requests not tracked
- **Solution**: Initialize App Insights BEFORE Express setup

**3. GA4 Production Tracking**
- **Issue**: Not tracking in production
- **Solution**: Add measurement ID to Docker build args

---

## ✅ Acceptance Criteria

### Production Metrics (7/7) ✅
- ✅ Backend App Insights integrated
- ✅ Frontend App Insights integrated
- ✅ Application logs visible
- ✅ Errors tracked
- ✅ Performance metrics visible
- ✅ Alerts configured (4 rules)
- ✅ Alerts tested

### Product Metrics (4/4) ✅
- ✅ Google Analytics integrated
- ✅ Page views tracked
- ✅ User sessions tracked
- ✅ Custom events tracked

### Documentation (2/2) ✅
- ✅ [App Insights Guide](../monitoring/README.md)
- ✅ [Google Analytics Guide](../monitoring/google-analytics.md)

**Total**: 13/13 Criteria Met (100%)

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| [setup-guide.md](../monitoring/setup-guide.md) | Step-by-step setup |
| [README.md](../monitoring/README.md) | App Insights usage |
| [google-analytics.md](../monitoring/google-analytics.md) | GA4 usage |
| [alerts-setup.md](../monitoring/alerts-setup.md) | Alert configuration |

---

## 💰 Cost

| Service | Free Tier | Usage | Cost |
|---------|-----------|-------|------|
| Azure App Insights | 5 GB/month | 1-5 GB | $0 |
| Google Analytics 4 | Unlimited | N/A | $0 |
| Azure Alerts | 10 rules | 4 rules | $0 |
| **Total** | | | **$0/month** |

---

## 📝 Summary

**Status**: ✅ Completed (100%)
**Deployment**: Production on AKS
**Monitoring**: Active and Verified
**Cost**: $0/month (Free Tier)

### Delivered

- Complete Azure App Insights integration (backend + frontend)
- Google Analytics 4 for product analytics
- Custom event and metric tracking
- 4 proactive alert rules with email notifications
- Comprehensive documentation
- Production deployment verified

**Live Monitoring**:
- App: https://57.158.73.138.nip.io/
- Azure Portal: mindx-app-insights
- Google Analytics: MindX Full Stack App

---

**Prepared by**: Le Thanh Cong
**Status**: Production Ready ✅
