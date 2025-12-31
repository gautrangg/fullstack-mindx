# Kubernetes Configuration

This directory contains Kubernetes manifests for deploying the MindX Full-Stack application.

## Prerequisites

- kubectl configured to connect to your AKS cluster
- cert-manager installed in the cluster
- Nginx ingress controller installed

## Secrets Configuration

Before deploying, you need to create the OpenID secrets:

```bash
kubectl create secret generic openid-secrets \
  --from-literal=OPENID_CLIENT_ID=your-client-id \
  --from-literal=OPENID_CLIENT_SECRET=your-client-secret \
  --from-literal=OPENID_PROVIDER=https://id-dev.mindx.edu.vn \
  --from-literal=CALLBACK_URI=https://your-domain.com/auth/callback \
  --from-literal=FRONTEND_URL=https://your-domain.com
```

## Deployment Order

1. Create secrets (see above)
2. Deploy backend:
   ```bash
   kubectl apply -f backend-deployment.yaml
   kubectl apply -f backend-service.yaml
   ```

3. Deploy frontend:
   ```bash
   kubectl apply -f frontend-deployment.yaml
   kubectl apply -f frontend-service.yaml
   ```

4. Apply ingress:
   ```bash
   kubectl apply -f ingress.yaml
   ```

5. Apply cert-manager cluster issuer:
   ```bash
   kubectl apply -f clusterissuer.yaml
   ```

## Verify Deployment

```bash
# Check pods
kubectl get pods

# Check services
kubectl get services

# Check ingress
kubectl get ingress

# Check certificates
kubectl get certificate
```

## Ingress Configuration

The application uses 3 separate ingress resources:

- **mindx-api-ingress**: Routes `/api/*` to backend with path rewriting
- **mindx-auth-ingress**: Routes `/auth` to backend without rewriting
- **mindx-web-ingress**: Routes `/` to frontend

This separation is necessary to avoid rewrite-target annotation conflicts.

## Updating Images

After building new Docker images:

```bash
# Restart deployments to pull new images
kubectl rollout restart deployment/mindx-api
kubectl rollout restart deployment/mindx-web

# Check rollout status
kubectl rollout status deployment/mindx-api
kubectl rollout status deployment/mindx-web
```

## Troubleshooting

```bash
# View pod logs
kubectl logs <pod-name>

# Describe pod
kubectl describe pod <pod-name>

# Get all resources
kubectl get all

# Check ingress details
kubectl describe ingress mindx-api-ingress
kubectl describe ingress mindx-auth-ingress
kubectl describe ingress mindx-web-ingress
```
