# Azure Application Insights Guide

This guide explains how to access and interpret production metrics in Azure Application Insights.

## Overview

Azure Application Insights is integrated with both the backend API and frontend application to provide comprehensive monitoring of:
- HTTP requests and response times
- Exceptions and errors
- Custom events (authentication, user actions)
- Performance metrics
- Dependencies (external API calls)

## Accessing App Insights

### Azure Portal
1. Navigate to: https://portal.azure.com
2. Search for "Application Insights" or find your resource
3. Click on your App Insights resource: `mindx-app-insights`

## Key Dashboards and Features

### 1. Application Dashboard
**Path**: Azure Portal > App Insights > Application Dashboard (Overview)

**What it shows**:
- Request rate (requests per second)
- Average response time
- Failed requests count
- Server exceptions
- Availability percentage

**How to use**:
- Quick health check of your application
- Spot trends over time (last 24 hours by default)
- Click any metric to drill down

### 2. Transaction Search
**Path**: Azure Portal > App Insights > Transaction search (under Investigate)

**What it shows**:
- Real-time list of all telemetry events
- Requests, dependencies, exceptions, custom events

**How to use**:
1. Select time range (e.g., "Last 30 minutes")
2. Filter by event type:
   - Requests: HTTP calls to your API
   - Custom Events: Auth events, user actions
   - Exceptions: Errors and exceptions
3. Click any event to see full details

**Example queries**:
- Find failed requests: Filter by "Failed requests"
- Find login events: Filter by "Custom Events" > Search "Auth_LoginSuccess"

### 3. Performance
**Path**: Azure Portal > App Insights > Performance (under Investigate)

**What it shows**:
- Average duration by operation (endpoint)
- Dependencies duration (external API calls)
- Slowest operations

**How to use**:
- Identify slow endpoints
- Click on an operation to see:
  - Timeline of execution
  - Dependencies called
  - Sample requests
- Optimize endpoints with high duration

**Example**:
- If `/auth/callback` is slow, check if MindX OpenID API is slow
- Look at "Dependencies" tab to see external call times

### 4. Failures
**Path**: Azure Portal > App Insights > Failures (under Investigate)

**What it shows**:
- Failed requests grouped by operation
- Exception types and counts
- Top 3 response codes

**How to use**:
- Click on failed operation to see stack traces
- Review exception details
- Fix issues based on error messages

**Common errors to look for**:
- 401 Unauthorized: Token/session issues
- 500 Internal Server Error: Backend crashes
- `Auth_LoginFailed` events: Authentication problems

### 5. Metrics Explorer
**Path**: Azure Portal > App Insights > Metrics (under Monitoring)

**What it shows**:
- Custom metrics you can chart
- Build custom dashboards

**Useful metrics**:
- `requests/count`: Total requests
- `requests/duration`: Response time
- `requests/failed`: Failed request count
- `exceptions/count`: Exception count
- Custom: `API_ResponseTime`, `Auth_*` events

**How to create a chart**:
1. Click "+ New chart"
2. Select metric (e.g., "Custom Metrics > API_ResponseTime")
3. Select aggregation (Avg, Sum, Count)
4. Add filters (e.g., by route)
5. Save to dashboard

---

## Custom Metrics Reference

### Authentication Events
These track user authentication flows:

#### `Auth_LoginSuccess`
- **When**: User successfully authenticates
- **Properties**:
  - `userId`: User ID
  - `provider`: Always "mindx-openid"
  - `timestamp`: ISO timestamp

**Query example** (Logs):
```kusto
customEvents
| where name == "Auth_LoginSuccess"
| where timestamp > ago(24h)
| summarize count() by bin(timestamp, 1h)
```

#### `Auth_LoginFailed`
- **When**: Authentication fails
- **Properties**:
  - `error`: Error description
  - `code`: Authorization code (if available)
  - `timestamp`: ISO timestamp

**Query example**:
```kusto
customEvents
| where name == "Auth_LoginFailed"
| where timestamp > ago(7d)
| summarize failCount = count() by tostring(customDimensions.error)
```

#### `Auth_Logout`
- **When**: User logs out
- **Properties**:
  - `userId`: User ID
  - `timestamp`: ISO timestamp

### Performance Metrics

#### `API_ResponseTime`
- **When**: Every API request completes
- **Value**: Duration in milliseconds
- **Properties**:
  - `route`: API endpoint path
  - `method`: HTTP method (GET, POST, etc.)
  - `statusCode`: HTTP response code

**Query example**:
```kusto
customMetrics
| where name == "API_ResponseTime"
| summarize avg(value) by tostring(customDimensions.route)
| order by avg_value desc
```

---

## Kusto Query Language (KQL) Examples

Access Logs via: **Azure Portal > App Insights > Logs**

### Example 1: Failed Login Attempts Over Time
```kusto
customEvents
| where name == "Auth_LoginFailed"
| where timestamp > ago(24h)
| summarize count() by bin(timestamp, 1h)
| render timechart
```

### Example 2: Average API Response Time by Endpoint
```kusto
customMetrics
| where name == "API_ResponseTime"
| summarize avg(value) by tostring(customDimensions.route)
| order by avg_value desc
```

### Example 3: Exception Rate Over Time
```kusto
exceptions
| where timestamp > ago(7d)
| summarize count() by bin(timestamp, 1h)
| render timechart
```

### Example 4: Top Error Messages
```kusto
exceptions
| where timestamp > ago(24h)
| summarize count() by outerMessage
| order by count_ desc
| take 10
```

### Example 5: Request Success Rate
```kusto
requests
| where timestamp > ago(24h)
| summarize
    total = count(),
    failed = countif(success == false)
| extend successRate = (total - failed) * 100.0 / total
```

### Example 6: User Activity (Logins per Hour)
```kusto
customEvents
| where name == "Auth_LoginSuccess"
| where timestamp > ago(24h)
| summarize users = dcount(tostring(customDimensions.userId)) by bin(timestamp, 1h)
| render timechart
```

---

## Common Troubleshooting Scenarios

### Scenario 1: High Error Rate Alert
**Steps**:
1. Go to Failures dashboard
2. Check "Top 3 failed operations"
3. Click on failed operation
4. Review stack trace and exception details
5. Check if it's a known issue or needs code fix

### Scenario 2: Slow API Performance
**Steps**:
1. Go to Performance dashboard
2. Sort operations by duration
3. Click on slowest operation
4. Check Dependencies tab
5. Identify bottleneck (database, external API, etc.)

### Scenario 3: Authentication Issues
**Steps**:
1. Go to Logs
2. Run query:
   ```kusto
   customEvents
   | where name startswith "Auth_"
   | where timestamp > ago(1h)
   | order by timestamp desc
   ```
3. Look for `Auth_LoginFailed` events
4. Check error property for details

### Scenario 4: Frontend vs Backend Issues
**Frontend telemetry**: Tagged with `ai.cloud.role = "frontend"`
**Backend telemetry**: Tagged with `ai.cloud.role = "backend"`

Query to separate:
```kusto
requests
| where timestamp > ago(1h)
| summarize count() by cloud_RoleName
```

---

## Best Practices

### 1. Set Up Dashboards
- Create custom dashboards for key metrics
- Pin important charts to Azure Portal home
- Share dashboards with team

### 2. Regular Monitoring
- Check dashboards daily
- Review failures weekly
- Analyze trends monthly

### 3. Use Alerts
- Set up alerts for critical metrics (see [alerts-setup.md](./alerts-setup.md))
- Configure action groups for notifications
- Test alerts regularly

### 4. Sampling
- Current setting: Sampling disabled for accuracy
- For high-traffic apps, enable adaptive sampling to reduce costs
- Access via: Configuration > Sampling

### 5. Data Retention
- Default: 90 days
- For longer retention, export to Log Analytics or Storage
- Access via: Configure > Usage and estimated costs

---

## Cost Optimization

- Current ingestion: ~1-5 GB/month (estimated for small app)
- First 5 GB/month: Free
- Beyond 5 GB: ~$2.30/GB

**Ways to reduce costs**:
1. Enable sampling (50% reduces cost by 50%)
2. Disable Live Metrics
3. Filter out noisy telemetry
4. Review and adjust retention period

---

## Integration with Development Workflow

### Local Testing
Test App Insights locally:
```bash
# Trigger test events
curl http://localhost:3000/test/event
curl http://localhost:3000/test/metric
curl http://localhost:3000/test/error
```

Check Azure Portal > Transaction search after 2-3 minutes.

### CI/CD Integration
- Monitor deployment impact on performance
- Set up deployment annotations
- Alert on error rate spikes after deployment

---

## Resources

- [App Insights Documentation](https://docs.microsoft.com/en-us/azure/azure-monitor/app/app-insights-overview)
- [KQL Quick Reference](https://docs.microsoft.com/en-us/azure/data-explorer/kql-quick-reference)
- [Sample Queries](https://docs.microsoft.com/en-us/azure/azure-monitor/app/analytics)

---

## Quick Reference

| Task | Path |
|------|------|
| Check current errors | Failures > Failed operations |
| See slow endpoints | Performance > Operations |
| View custom events | Transaction search > Custom Events |
| Write KQL queries | Logs > New Query |
| Configure alerts | Alerts > New alert rule |
| View costs | Usage and estimated costs |
| Export data | Continuous export |

---

Need help? Check [setup-guide.md](./setup-guide.md) for configuration or [alerts-setup.md](./alerts-setup.md) for alerting.
