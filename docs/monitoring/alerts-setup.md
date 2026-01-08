# Azure Alerts Setup Guide

This guide walks you through setting up production alerts for your MindX application using Azure Monitor.

## Overview

Alerts notify you when critical issues occur, allowing you to respond quickly. We'll set up alerts for:
1. High error rate
2. Slow API response times
3. Exception spikes
4. Failed login attempts

## Prerequisites

- Azure App Insights resource created and configured
- Application deployed and sending telemetry
- Email address for notifications

---

## Part 1: Create Action Group

Action groups define WHO gets notified and HOW.

### Step 1: Navigate to Action Groups
1. Go to Azure Portal > App Insights > Alerts
2. Click "Action groups"
3. Click "+ Create"

### Step 2: Configure Action Group Basics
Fill in:
- **Subscription**: Your subscription
- **Resource group**: Same as App Insights
- **Action group name**: `mindx-alerts-email`
- **Display name**: `MindX Alerts`

Click "Next: Notifications"

### Step 3: Add Email Notification
1. **Notification type**: Email/SMS message/Push/Voice
2. Click "Email" checkbox
3. **Email**: Enter your email address
4. **Name**: `Primary Email`
5. Click "OK"

### Step 4: Review and Create
1. Click "Next: Actions" (skip for now)
2. Click "Review + create"
3. Click "Create"

You should receive a confirmation email. Click the link to verify.

---

## Part 2: Alert Rule #1 - High Error Rate

Triggers when too many requests fail.

### Step 1: Create Alert Rule
1. Go to Azure Portal > App Insights > Alerts
2. Click "+ Create" > "Alert rule"

### Step 2: Define Scope
- Should auto-select your App Insights resource
- If not, click "Select resource" and choose `mindx-app-insights`
- Click "Next: Condition"

### Step 3: Configure Condition
1. Click "Add condition"
2. Search for: "Failed requests"
3. Select "Failed requests" signal

Configure:
- **Aggregation type**: Total
- **Operator**: Greater than
- **Threshold value**: `5`
- **Unit**: Count
- **Aggregation granularity**: 5 minutes
- **Frequency of evaluation**: Every 1 minute

This means: Alert if more than 5 failed requests in any 5-minute window.

Click "Next: Actions"

### Step 4: Select Action Group
1. Click "+ Select action groups"
2. Select `mindx-alerts-email`
3. Click "Select"
4. Click "Next: Details"

### Step 5: Alert Rule Details
Fill in:
- **Alert rule name**: `High Error Rate`
- **Description**: `Triggered when error rate exceeds 5 failures in 5 minutes`
- **Severity**: 2 - Warning
- **Enable upon creation**: Yes

Click "Review + create" > "Create"

---

## Part 3: Alert Rule #2 - Slow API Response

Triggers when API becomes slow.

### Steps:
1. Go to Alerts > "+ Create" > "Alert rule"
2. Scope: Your App Insights resource

### Condition:
- Signal: "Server response time"
- Aggregation type: Average
- Operator: Greater than
- Threshold: `2000` (milliseconds = 2 seconds)
- Aggregation granularity: 5 minutes
- Frequency: Every 1 minute

### Action Group:
- Select `mindx-alerts-email`

### Details:
- Name: `Slow API Response`
- Description: `Triggered when average response time exceeds 2 seconds`
- Severity: 3 - Informational

Create the alert.

---

## Part 4: Alert Rule #3 - Exception Spike

Triggers when many exceptions occur.

### Steps:
1. Create new alert rule
2. Scope: Your App Insights resource

### Condition:
- Signal: "Exceptions"
- Aggregation type: Count
- Operator: Greater than
- Threshold: `10`
- Aggregation granularity: 5 minutes
- Frequency: Every 1 minute

### Action Group:
- Select `mindx-alerts-email`

### Details:
- Name: `High Exception Rate`
- Description: `Triggered when more than 10 exceptions occur in 5 minutes`
- Severity: 1 - Error

Create the alert.

---

## Part 5: Alert Rule #4 - Failed Login Attempts (Custom)

Triggers when many login attempts fail (potential security issue).

### Step 1: Create Alert Rule
1. Go to Alerts > "+ Create" > "Alert rule"
2. Scope: Your App Insights resource
3. Click "Next: Condition"

### Step 2: Configure Custom Metric
1. Click "Add condition"
2. Search for: "Custom"
3. Select "Custom log search"

### Step 3: Define Log Query
Paste this Kusto query:

```kusto
customEvents
| where name == "Auth_LoginFailed"
| where timestamp > ago(10m)
| summarize count()
```

Configure:
- **Measurement**:
  - Measure: `count`
  - Aggregation type: Total
- **Split by dimensions**: None
- **Alert logic**:
  - Operator: Greater than
  - Threshold value: `10`
  - Frequency of evaluation: 5 minutes
- **Number of violations**: 1 out of the last 1 period

This means: Alert if more than 10 failed logins in last 10 minutes.

### Step 4: Select Action Group
- Select `mindx-alerts-email`

### Step 5: Details
- Name: `Failed Login Spike`
- Description: `Triggered when more than 10 login failures occur in 10 minutes`
- Severity: 2 - Warning

Create the alert.

---

## Part 6: Testing Alerts

It's crucial to test that alerts actually fire!

### Test Error Rate Alert

**Method 1: Use Test Endpoint** (Development)
```bash
# Trigger 10 errors quickly
for i in {1..10}; do curl http://localhost:3000/test/error; done
```

**Method 2: Simulate Error** (Production)
```bash
# Call non-existent endpoint
for i in {1..10}; do curl https://57.158.73.138.nip.io/api/nonexistent; done
```

### Test Failed Login Alert

Attempt to login multiple times and cancel/fail the authentication:
1. Click Login button
2. Cancel on MindX login page
3. Repeat 10+ times within 10 minutes

### Test Exception Alert

```bash
# Use test endpoint
for i in {1..15}; do curl http://localhost:3000/test/error; done
```

### Verify Alert Fired

1. Go to Azure Portal > App Insights > Alerts
2. Check "Fired alerts" section
3. You should see your alert in the list
4. Check your email for notification

**Typical delay**: 2-5 minutes from trigger to email

---

## Part 7: Managing Alerts

### View Alert History
**Path**: Azure Portal > App Insights > Alerts > Alert history

Shows:
- When alerts fired
- Current state (Fired/Resolved)
- Who was notified
- Alert duration

### Temporarily Disable Alert
1. Go to Alerts > Alert rules
2. Click on alert rule name
3. Click "Disable"
4. Remember to re-enable later!

**Use case**: During planned maintenance or testing

### Modify Alert Threshold
1. Go to Alert rules
2. Click alert name
3. Click "Edit"
4. Modify condition threshold
5. Save changes

**Example**: If getting too many false positives, increase threshold from 5 to 10.

### Delete Alert
1. Go to Alert rules
2. Select alert(s) to delete
3. Click "Delete"
4. Confirm

---

## Part 8: Advanced Alert Configurations

### Dynamic Thresholds

Instead of static thresholds, use machine learning:

1. When creating alert condition
2. Select "Dynamic" instead of "Static" threshold
3. Configure:
   - Sensitivity: Medium
   - Violations: 2 out of last 4 periods
   - Ignore data before: (start date)

**Benefits**:
- Adapts to normal traffic patterns
- Reduces false positives
- Detects anomalies automatically

**Use case**: Traffic varies significantly by time of day

### Multi-dimensional Alerts

Alert on specific routes only:

1. In condition configuration
2. Click "Add filter"
3. Dimension: `cloud_RoleName`
4. Operator: `=`
5. Values: `backend`

**Use case**: Only alert on backend errors, not frontend

### Alert Suppression

Prevent alert fatigue:

**Path**: Alert rule > Actions > Alert processing rules

Configure:
- **Suppress notifications**: For 1 hour after first alert
- **During maintenance**: Suppress all alerts on schedule

---

## Part 9: Email Notification Format

When alert fires, you'll receive email with:

**Subject**: `[Sev 2] High Error Rate fired for mindx-app-insights`

**Body includes**:
- Alert name and description
- Severity level
- Time fired
- Affected resource
- Condition that triggered
- Link to Azure Portal
- Current metric value

**Example**:
```
Alert Name: High Error Rate
Severity: Warning (2)
Time: 2024-01-15 10:30:00 UTC
Condition: Failed requests > 5
Current Value: 8 failed requests
```

### Resolve Notification

When issue resolves, you'll get second email:

**Subject**: `[Sev 2] High Error Rate resolved for mindx-app-insights`

---

## Part 10: Alert Response Procedures

### When You Receive Alert

1. **Don't Panic**: Alerts are warnings, not always critical
2. **Check Azure Portal**: Verify alert details
3. **Review App Insights**: Go to Failures or Performance dashboard
4. **Investigate**:
   - Check recent deployments
   - Review error logs
   - Check external dependencies (MindX API status)
5. **Take Action**:
   - Fix code issues
   - Rollback deployment if needed
   - Scale resources if needed
6. **Document**: Note issue and resolution

### Alert Escalation

**Severity levels**:
- **Sev 0 (Critical)**: Service down, immediate action required
- **Sev 1 (Error)**: Major functionality impaired
- **Sev 2 (Warning)**: Degraded performance, monitor closely
- **Sev 3 (Informational)**: FYI, no immediate action needed

**Current setup**:
- High Error Rate: Sev 2 (Warning)
- Slow API: Sev 3 (Informational)
- High Exceptions: Sev 1 (Error)
- Failed Logins: Sev 2 (Warning)

---

## Part 11: Cost Considerations

Azure Monitor Alerts pricing:
- First 10 alert rules: Free
- Additional rules: $0.10/month each
- Email notifications: Free
- SMS notifications: $0.075 per message

**Our setup**: 4 alert rules = **FREE** ✅

**Cost optimization**:
- Use email over SMS
- Set appropriate thresholds to avoid spam
- Consolidate related alerts

---

## Part 12: Best Practices

### 1. Start Conservative
- Begin with higher thresholds
- Adjust based on actual patterns
- Avoid alert fatigue

### 2. Document Everything
- Keep alert logic documented
- Note threshold reasoning
- Update when changing

### 3. Test Regularly
- Test alerts quarterly
- Verify email delivery
- Update contact information

### 4. Review and Improve
- Monthly review of alerts fired
- Tune thresholds
- Remove unnecessary alerts

### 5. Use Appropriate Severity
- Reserve Sev 0-1 for critical issues
- Most alerts should be Sev 2-3
- Don't over-escalate

---

## Troubleshooting

### Alert Not Firing

**Check**:
1. Alert rule is enabled
2. Condition threshold is correct
3. Metric data is flowing to App Insights
4. Evaluation frequency is set
5. Wait for evaluation period to complete

### Not Receiving Emails

**Check**:
1. Email verified in action group
2. Check spam folder
3. Verify action group is selected in alert rule
4. Check Azure Service Health for issues

### Too Many False Positives

**Solutions**:
1. Increase threshold value
2. Increase aggregation granularity
3. Add more conditions (AND logic)
4. Use dynamic thresholds
5. Add suppression rules

### Alert Fires But Issue Unclear

**Actions**:
1. Review alert description
2. Check linked App Insights data
3. Review recent changes/deployments
4. Correlate with other alerts

---

## Summary

You've successfully set up:
- ✅ Email notification action group
- ✅ High error rate alert
- ✅ Slow API response alert
- ✅ Exception spike alert
- ✅ Failed login attempt alert

Your production application now has comprehensive alerting! 🎉

---

## Next Steps

1. Test all alerts to verify they work
2. Document on-call procedures for your team
3. Set up Azure Dashboard for quick overview
4. Consider adding alerts for:
   - Dependency failures (external APIs)
   - Low availability
   - High memory/CPU usage
   - Custom business metrics

---

## Resources

- [Azure Monitor Alerts Documentation](https://docs.microsoft.com/en-us/azure/azure-monitor/alerts/alerts-overview)
- [Action Groups](https://docs.microsoft.com/en-us/azure/azure-monitor/alerts/action-groups)
- [Alert Rule Best Practices](https://docs.microsoft.com/en-us/azure/azure-monitor/best-practices-alerts)

---

Need help? Check [README.md](./README.md) for App Insights usage or [setup-guide.md](./setup-guide.md) for configuration.
