# Week 2: Monitoring Setup Guide

This guide will walk you through setting up Azure Application Insights and Google Analytics for your MindX full-stack application.

## Prerequisites

- Azure account with active subscription
- Google account
- Access to your AKS cluster (for production deployment)

## Part 1: Create Azure Application Insights Resource

### Step 1: Navigate to Azure Portal
1. Go to https://portal.azure.com
2. Sign in with your Azure account

### Step 2: Create Application Insights Resource
1. Click **"Create a resource"** (+ icon in the top left)
2. Search for **"Application Insights"**
3. Click **"Create"**

### Step 3: Configure Application Insights
Fill in the following details:

- **Subscription**: Select your subscription
- **Resource Group**:
  - Use existing resource group (same as your AKS cluster)
  - Or create new: `mindx-monitoring-rg`
- **Name**: `mindx-app-insights`
- **Region**: **Same region as your AKS cluster** (important for performance)
- **Resource Mode**: Classic (or Workspace-based if you prefer)

4. Click **"Review + Create"**
5. Click **"Create"**
6. Wait for deployment to complete (usually takes 1-2 minutes)

### Step 4: Get Connection String
1. Once deployed, click **"Go to resource"**
2. In the Overview page, find **"Connection String"**
3. Click the copy icon to copy the entire connection string
4. It will look like:
   ```
   InstrumentationKey=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx;IngestionEndpoint=https://region.applicationinsights.azure.com/;LiveEndpoint=https://region.livediagnostics.monitor.azure.com/
   ```
5. **Save this for later** - you'll need it for configuration

---

## Part 2: Create Google Analytics 4 Property

### Step 1: Navigate to Google Analytics
1. Go to https://analytics.google.com
2. Sign in with your Google account

### Step 2: Create New Property
1. Click **"Admin"** (gear icon in the bottom left)
2. In the "Property" column, click **"Create Property"**

### Step 3: Configure Property Details
Fill in the following:

- **Property name**: `MindX Full Stack App`
- **Reporting time zone**: Select your timezone
- **Currency**: Select your currency

4. Click **"Next"**

### Step 4: Business Details (Optional)
- **Industry category**: Select appropriate category
- **Business size**: Select your size
- Click **"Next"**

### Step 5: Business Objectives (Optional)
- Select objectives or skip
- Click **"Create"**
- Accept Terms of Service

### Step 6: Set Up Data Stream
1. Select platform: **"Web"**
2. Fill in:
   - **Website URL**: `https://57.158.73.138.nip.io` (your production URL)
   - **Stream name**: `MindX Production`
3. Click **"Create stream"**

### Step 7: Get Measurement ID
1. After creating the stream, you'll see the **Measurement ID**
2. It will look like: `G-XXXXXXXXXX`  
3. **Copy and save this** - you'll need it for configuration

---
---

## Part 3: Configure Local Development

### Step 1: Update Backend .env File
1. Open `fullstack-mindx/backend/.env`
2. Add your App Insights connection string:
   ```env
   APPLICATIONINSIGHTS_CONNECTION_STRING=InstrumentationKey=...your-actual-connection-string...
   ```

### Step 2: Update Frontend .env.local File
1. Open `fullstack-mindx/frontend/.env.local`
2. Add both connection strings:
   ```env
   VITE_APPLICATIONINSIGHTS_CONNECTION_STRING=InstrumentationKey=...your-actual-connection-string...
   VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   ```

### Step 3: Test Locally
1. Start the backend:
   ```bash
   cd fullstack-mindx/backend
   npm run dev
   ```
   You should see: `✅ Azure App Insights initialized`

2. Start the frontend:
   ```bash
   cd fullstack-mindx/frontend
   npm run dev
   ```
   You should see:
   - `✅ Frontend App Insights initialized`
   - `✅ Google Analytics initialized`

3. Open http://localhost:5173 and navigate around
4. Check Azure Portal > App Insights > Transaction search (wait 2-3 minutes for data)
5. Check Google Analytics > Real-time report (should update immediately)

---

## Part 4: Deploy to Production

### Step 1: Create Kubernetes Secrets
1. Copy the secrets template:
   ```bash
   cd fullstack-mindx/k8s
   cp monitoring-secrets.yaml.example monitoring-secrets.yaml
   ```

2. Edit `monitoring-secrets.yaml` with your actual values:
   ```yaml
   stringData:
     APPLICATIONINSIGHTS_CONNECTION_STRING: "InstrumentationKey=...your-actual-value..."
     VITE_APPLICATIONINSIGHTS_CONNECTION_STRING: "InstrumentationKey=...your-actual-value..."
     VITE_GA_MEASUREMENT_ID: "G-XXXXXXXXXX"
   ```

3. Apply the secrets to your cluster:
   ```bash
   kubectl apply -f monitoring-secrets.yaml
   ```

4. Verify secrets were created:
   ```bash
   kubectl get secrets monitoring-secrets
   ```

### Step 2: Build Docker Images with Analytics
1. Build backend image:
   ```bash
   cd fullstack-mindx/backend
   docker build -t conglt.azurecr.io/mindx-api:latest .
   docker push conglt.azurecr.io/mindx-api:latest
   ```

2. Build frontend image **with build arguments**:
   ```bash
   cd fullstack-mindx/frontend
   docker build \
     --build-arg VITE_API_BASE_URL=https://57.158.73.138.nip.io/api \
     --build-arg VITE_APPLICATIONINSIGHTS_CONNECTION_STRING="InstrumentationKey=..." \
     --build-arg VITE_GA_MEASUREMENT_ID="G-XXXXXXXXXX" \
     -t conglt.azurecr.io/mindx-frontend:latest .
   docker push conglt.azurecr.io/mindx-frontend:latest
   ```

### Step 3: Deploy to AKS
1. Apply updated backend deployment:
   ```bash
   kubectl apply -f k8s/backend-deployment.yaml
   ```

2. Restart deployments to use new images:
   ```bash
   kubectl rollout restart deployment/mindx-api
   kubectl rollout restart deployment/mindx-web
   ```

3. Check deployment status:
   ```bash
   kubectl get pods
   kubectl logs deployment/mindx-api
   kubectl logs deployment/mindx-web
   ```

### Step 4: Verify Production Monitoring
1. Visit your production URL: https://57.158.73.138.nip.io
2. Navigate around, login/logout
3. Check Azure App Insights:
   - Portal > App Insights > Transaction search
   - Should see requests from both backend and frontend
4. Check Google Analytics:
   - Admin > Real-time report
   - Should see active users

---

## Part 5: Configure Alerts (Optional but Recommended)

See [alerts-setup.md](./alerts-setup.md) for detailed instructions on setting up email alerts for:
- High error rates
- Slow response times
- Exceptions
- Failed logins

---

## Troubleshooting

### Backend App Insights Not Working
- Check if connection string is set correctly in `.env` or Kubernetes secrets
- Look for warning: `⚠️ App Insights connection string not found`
- Verify connection string format includes `InstrumentationKey` and `IngestionEndpoint`

### Frontend Analytics Not Working
- Check browser console for initialization messages
- Verify environment variables are set during build (for production)
- For local dev, check `.env.local` file exists and has values
- Remember: Frontend env vars must be set at build time, not runtime

### No Data in Azure Portal
- Wait 2-5 minutes for data to appear
- Check Transaction search, not just Application Dashboard
- Verify clock time is correct on your machine
- Check Sampling settings haven't filtered out all data

### Google Analytics Not Tracking
- Check Real-time report (updates immediately)
- Verify Measurement ID format: `G-XXXXXXXXXX`
- Check browser ad blockers or privacy extensions
- Ensure cookies are enabled

### Kubernetes Pods Crashing
- Check logs: `kubectl logs deployment/mindx-api`
- Verify secrets exist: `kubectl get secrets`
- Check secret keys match: `kubectl describe secret monitoring-secrets`

---

## Next Steps

1. ✅ Review [README.md](./README.md) to understand how to use App Insights
2. ✅ Review [google-analytics.md](./google-analytics.md) to understand GA reports
3. ✅ Set up [alerts](./alerts-setup.md) for production monitoring
4. ✅ Test the monitoring by triggering test endpoints: `/test/error`, `/test/event`, `/test/metric`

---

## Summary

You've successfully set up:
- ✅ Azure Application Insights for backend and frontend
- ✅ Google Analytics 4 for product analytics
- ✅ Custom event tracking for authentication and navigation
- ✅ Production deployment on AKS

Your application now has comprehensive monitoring and analytics!
