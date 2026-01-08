# Google Analytics 4 Guide

This guide explains how to access and interpret product metrics in Google Analytics 4.

## Overview

Google Analytics 4 (GA4) is integrated with the frontend application to track:
- Page views and navigation
- User sessions and engagement
- Custom events (login, logout, navigation clicks)
- User demographics and behavior
- Conversion funnels

## Accessing Google Analytics

1. Navigate to: https://analytics.google.com
2. Select your property: **MindX Full Stack App**
3. Use the left sidebar to navigate between reports

## Key Reports

### 1. Real-time Overview
**Path**: Reports > Realtime

**What it shows**:
- Active users right now
- Pages being viewed
- Events happening in real-time
- User locations
- Traffic sources

**How to use**:
- **Best for**: Immediate verification that tracking works
- Test your implementation by visiting the site and watching yourself appear
- Monitor live events during deployments or marketing campaigns
- Data updates every few seconds

**What to look for**:
- Active users count
- Current page views
- Events firing (login, navigation clicks)

---

### 2. User Acquisition
**Path**: Reports > Acquisition > User acquisition

**What it shows**:
- How users first discovered your app
- Traffic sources (Direct, Referral, Organic Search, etc.)
- New vs returning users
- Engagement metrics by source

**How to use**:
- Understand where your traffic comes from
- Compare different channels' effectiveness
- Identify successful marketing efforts

**Common sources**:
- **Direct**: Users typing URL directly
- **Referral**: Links from other websites
- **Organic Search**: Google, Bing search results
- **Social**: Social media platforms

---

### 3. Engagement Overview
**Path**: Reports > Engagement > Overview

**What it shows**:
- Most viewed pages
- Average engagement time
- Events per user
- User interaction patterns

**Key metrics**:
- **Views**: Total page views
- **Users**: Unique visitors to each page
- **Average engagement time**: How long users spend
- **Event count**: Number of interactions

**Pages tracked**:
- `/`: Home page
- `/dashboard`: Protected dashboard page

---

### 4. Pages and Screens
**Path**: Reports > Engagement > Pages and screens

**What it shows**:
- Detailed page-level metrics
- Time spent on each page
- Entry and exit pages
- Page navigation flow

**How to use**:
- Identify most popular pages
- Find pages with high bounce rates
- Optimize pages with low engagement
- Understand user journey through app

---

### 5. Events
**Path**: Reports > Engagement > Events

**What it shows**:
- All custom events being tracked
- Event counts and trends
- Event parameters

**Events we track**:

| Event | Description | When Triggered |
|-------|-------------|----------------|
| `page_view` | Page viewed | Every route change |
| `Navigation` | Navigation clicks | Logo, Login, Logout clicks |
| `User` | User actions | Login, Logout |
| `Error` | Application errors | Auth failures, etc. |

**How to use**:
1. Click on event name to see details
2. View event parameters (category, action, label)
3. Create custom reports based on events
4. Set up conversions for important events

---

### 6. User Demographics (After 24-48 hours)
**Path**: Reports > User > User attributes

**What it shows** (when enough data collected):
- Age groups
- Gender distribution
- Interests
- Geographic location
- Technology (browser, device, OS)

**Note**: Demographics require time to collect and may not show immediately.

---

## Custom Events Reference

### Event 1: Navigation Clicks
**Event Name**: `Navigation`
**Category**: `Navigation`
**Action**: `Click`
**Label**:
- `Logo`: User clicked site logo
- `Login Button`: User clicked login
- `Logout Button`: User clicked logout

**Example query in Explore**:
1. Go to Explore > Free form
2. Add dimension: Event name
3. Add dimension: Event label
4. Filter: Event name = "Navigation"

### Event 2: User Authentication
**Event Name**: `User`
**Actions**:
- `Login`: User successfully logged in
- `Logout`: User logged out

**Parameters**:
- `label`: "openid-connect" for login method

**Use case**: Track authentication success rate, active login sessions

### Event 3: Errors
**Event Name**: `Error`
**Action**: Error description
**Label**: "Fatal" or "Non-Fatal"

**Use case**: Track application errors affecting user experience

---

## Creating Custom Reports

### Using Explore

**Path**: Explore > Create new exploration

1. **Free Form Exploration**:
   - Drag and drop dimensions and metrics
   - Build custom tables and charts
   - Export data

2. **Funnel Analysis**:
   - Create conversion funnels
   - Example: Home → Login → Dashboard
   - Identify drop-off points

3. **Path Exploration**:
   - Visualize user journey
   - See common navigation paths
   - Find unexpected user behavior

### Example: Login Funnel

1. Go to Explore > Funnel exploration
2. Create steps:
   - Step 1: `page_view` where page = "/"
   - Step 2: Event `Navigation` with label "Login Button"
   - Step 3: Event `User` with action "Login"
   - Step 4: `page_view` where page = "/dashboard"
3. View funnel visualization
4. Identify drop-off rates

---

## Common Tracking Scenarios

### Scenario 1: Monitor Login Success Rate

**Steps**:
1. Go to Events report
2. Filter events: `User`
3. Create comparison:
   - Login events
   - Login button clicks
4. Calculate: (Logins / Login clicks) * 100 = Success rate

### Scenario 2: Most Popular User Flows

**Steps**:
1. Go to Explore > Path exploration
2. Set starting point: `/` (homepage)
3. View next steps users take
4. Identify common paths to dashboard

### Scenario 3: Page Performance

**Steps**:
1. Go to Pages and screens report
2. Sort by "Average engagement time"
3. Identify:
   - Pages with low engagement (may need improvement)
   - Pages with high engagement (users find valuable)

### Scenario 4: Real-time Monitoring During Release

**Steps**:
1. Deploy new version
2. Open Real-time report
3. Watch for:
   - User activity
   - Error events spiking
   - Navigation patterns changing
4. Quick rollback if issues detected

---

## Audience Segmentation

Create user segments for detailed analysis:

**Path**: Configure > Audiences > Create Audience

### Example Segments:

1. **Active Users**:
   - Condition: Logged in last 7 days
   - Use: Target for feature announcements

2. **High-Engagement Users**:
   - Condition: Avg engagement time > 5 minutes
   - Use: Survey for feedback

3. **Bounced Users**:
   - Condition: Single page visit
   - Use: Improve landing page

---

## Setting Up Conversions

Mark important events as conversions:

**Path**: Configure > Events > Mark as conversion

### Recommended Conversions:
- `User` with action "Login": Track successful registrations
- `page_view` where page = "/dashboard": Track active usage
- Custom events for key user actions

**How to use**:
1. Go to Events list
2. Toggle "Mark as conversion" for important events
3. View conversion rates in Reports > Engagement > Conversions

---

## GA4 vs Azure App Insights

| Aspect | Google Analytics | App Insights |
|--------|------------------|--------------|
| **Focus** | Product analytics, user behavior | Application performance, errors |
| **Best for** | Marketing, UX analysis | Debugging, monitoring |
| **Data** | Page views, events, users | Requests, exceptions, metrics |
| **Users** | Product managers, marketers | Developers, DevOps |
| **Timing** | Real-time + historical trends | Real-time + performance |

**Use both together**:
- GA4: Understand *what* users do
- App Insights: Understand *how* app performs

---

## Privacy and Compliance

### GDPR Considerations
- GA4 automatically anonymizes IP addresses
- Users can opt-out via browser settings
- Consider adding cookie consent banner for EU users

### Data Retention
- Default: 2 months for user-level data
- Can extend to 14 months
- Configure: Admin > Data Settings > Data Retention

---

## Best Practices

### 1. Regular Monitoring
- Check Real-time during deployments
- Review weekly engagement reports
- Monthly trend analysis

### 2. Event Naming Consistency
- Use clear, descriptive names
- Follow consistent pattern (Category_Action_Label)
- Document all custom events

### 3. Set Up Alerts
- Configure email alerts for anomalies
- Monitor traffic drops
- Track conversion rate changes

### 4. Cross-Reference with App Insights
- GA shows user sees error page
- App Insights shows why error occurred
- Fix based on combined insights

---

## Troubleshooting

### No Data Showing
- Check Real-time report first (updates immediately)
- Verify Measurement ID is correct
- Check browser console for errors
- Disable ad blockers
- Wait 24-48 hours for historical reports

### Events Not Tracking
- Verify `trackEvent()` calls in code
- Check browser console for "GA initialized" message
- Test in incognito mode (avoid ad blockers)
- Verify event name matches in code and reports

### Wrong Data
- Clear browser cache
- Check date range in reports
- Verify filter settings
- Compare with App Insights data

---

## Analytics Dashboard Setup

Create a custom dashboard:

**Path**: Reports > Library > Create new report

### Recommended Widgets:
1. Active users (Real-time)
2. Page views by page
3. Login events per day
4. Average engagement time
5. Top traffic sources
6. Conversion funnel

**How to create**:
1. Go to Library
2. Click "Create new report"
3. Add cards for metrics
4. Customize layout
5. Save and publish

---

## Exporting Data

### Quick Export
- Click "Share" in any report
- Export as PDF or CSV
- Schedule email reports

### BigQuery Integration (Advanced)
- Link GA4 to BigQuery
- Run SQL queries on raw data
- Build custom analytics

---

## Resources

- [GA4 Documentation](https://support.google.com/analytics/answer/10089681)
- [GA4 Event Reference](https://support.google.com/analytics/answer/9322688)
- [GA4 vs Universal Analytics](https://support.google.com/analytics/answer/9964640)

---

## Quick Reference

| Task | Path |
|------|------|
| Check live activity | Reports > Realtime |
| View page analytics | Reports > Engagement > Pages |
| Track custom events | Reports > Engagement > Events |
| Create funnel | Explore > Funnel exploration |
| Set up conversion | Configure > Events > Mark as conversion |
| Export data | Share > Export |
| View demographics | Reports > User > Demographics |

---

Need help? Check [setup-guide.md](./setup-guide.md) for configuration or [README.md](./README.md) for App Insights comparison.
