import React from 'react'
import aiAgentMd from './ai-agent.md?raw'

export interface Chapter {
  id: string
  title: string
  completed: boolean
  content: string
}

export interface Tutorial {
  title: string
  description: string | React.ReactNode
  chapters: Chapter[]
}

export const tutorialData: Tutorial = {
  title: "n8n workflow",
  description: "This tutorial will guide you through creating an automated workflow with n8n, covering Gmail integration, AI agents, email states, and powerful tools.",
  chapters: [
    {
      id: "introduction",
      title: "Introduction",
      completed: false,
      content: `# Welcome to n8n Workshop

Welcome to our comprehensive n8n automation workshop! This tutorial will guide you through creating powerful automated workflows that can transform how you handle repetitive tasks.

## What You'll Learn

In this workshop, you'll master:

- **Gmail Integration**: Connect and automate your email workflows
- **AI Agent Setup**: Build intelligent automation with AI capabilities  
- **Email State Management**: Handle different email states and responses
- **Advanced Tools**: Leverage n8n's powerful toolkit for complex automation

## Prerequisites

Before we begin, make sure you have:

- [ ] A Gmail account for testing
- [ ] Basic understanding of workflow concepts
- [ ] n8n account (we'll help you set this up)

## Workshop Structure

Each chapter builds upon the previous one, so we recommend completing them in order. You can track your progress using the checkboxes as you go.

Let's get started! 🚀`
    },
    {
      id: "gmail",
      title: "Gmail Integration",
      completed: false,
      content: `# Gmail Integration

Learn how to connect Gmail to your n8n workflows and automate your email processes.

## Setting Up Gmail Connection

First, we need to establish a secure connection between n8n and your Gmail account.

### Step 1: Create Gmail Credentials

1. **Go to Google Cloud Console**
   - Navigate to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one

2. **Enable Gmail API**
   - Go to "APIs & Services" > "Library"
   - Search for "Gmail API" and enable it

3. **Create OAuth 2.0 Credentials**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client ID"
   - Configure the consent screen if prompted

### Step 2: Configure n8n Gmail Node

\`\`\`javascript
// Example Gmail trigger configuration
{
  "node": "Gmail Trigger",
  "operation": "watchEmails",
  "filters": {
    "subject": "Invoice",
    "from": "accounting@company.com"
  }
}
\`\`\`

## Common Gmail Operations

### Reading Emails
- **Get All Messages**: Retrieve all emails from inbox
- **Search Messages**: Find specific emails using filters
- **Get Message**: Get details of a specific email

### Sending Emails
- **Send Email**: Send new email messages
- **Reply to Email**: Respond to existing messages
- **Forward Email**: Forward messages to other recipients

## Best Practices

- [ ] Always use specific filters to avoid processing unnecessary emails
- [ ] Set up proper error handling for API rate limits
- [ ] Test with a dedicated test Gmail account first
- [ ] Use labels to organize processed emails

**Next**: Learn how to integrate AI agents into your email workflows!`
    },
    {
      id: "ai-agent",
      title: "AI Agent",
      completed: false,
      content: aiAgentMd
    },
    {
      id: "email-states",
      title: "Email States",
      completed: false,
      content: `# Email State Management

Learn to track and manage different states of emails throughout your automation workflows.

## Understanding Email States

Email states help you track where each email is in your process and ensure no messages fall through the cracks.

### Common Email States

- **New**: Freshly received, not yet processed
- **Processing**: Currently being handled by automation
- **Pending**: Waiting for external action or response
- **Completed**: Fully processed and resolved
- **Error**: Failed processing, needs attention

## Implementing State Tracking

### Using Gmail Labels for State Management

\`\`\`javascript
// State transition workflow
const emailStates = {
  NEW: "workflow/new",
  PROCESSING: "workflow/processing", 
  PENDING: "workflow/pending",
  COMPLETED: "workflow/completed",
  ERROR: "workflow/error"
};

// Update email state
await gmail.addLabel(messageId, emailStates.PROCESSING);
\`\`\`

### Database State Tracking

For more complex scenarios, use a database to track states:

\`\`\`javascript
// Email state record
{
  messageId: "unique-email-id",
  currentState: "processing",
  previousState: "new",
  stateHistory: [
    { state: "new", timestamp: "2024-01-15T10:00:00Z" },
    { state: "processing", timestamp: "2024-01-15T10:01:00Z" }
  ],
  metadata: {
    assignedTo: "user@company.com",
    priority: "high",
    category: "support"
  }
}
\`\`\`

## State Transition Rules

### Automatic State Changes

- [ ] **New → Processing**: When workflow starts
- [ ] **Processing → Pending**: When waiting for human input
- [ ] **Pending → Processing**: When human input received
- [ ] **Processing → Completed**: When successfully resolved
- [ ] **Any → Error**: When processing fails

### Manual State Changes

Allow team members to manually update states:

- **Reassign ownership**
- **Change priority**
- **Add notes and comments**
- **Set custom follow-up dates**

## Error Handling and Recovery

### Retry Mechanisms

\`\`\`javascript
// Retry logic for failed emails
if (email.state === "error" && email.retryCount < 3) {
  email.state = "processing";
  email.retryCount += 1;
  email.lastRetry = new Date();
}
\`\`\`

### Dead Letter Queue

For emails that repeatedly fail:

- [ ] Move to special "dead letter" state
- [ ] Alert administrators
- [ ] Log detailed error information
- [ ] Provide manual resolution options

## Monitoring and Reporting

Track your email processing performance:

### Key Metrics

- **Processing time** per state
- **Success rate** by email type
- **Bottlenecks** in the workflow
- **Error patterns** and common failures

### Dashboard Queries

\`\`\`sql
-- Emails by current state
SELECT state, COUNT(*) as count 
FROM email_states 
GROUP BY state;

-- Average processing time
SELECT AVG(TIMESTAMPDIFF(MINUTE, created_at, completed_at)) 
FROM email_states 
WHERE state = 'completed';
\`\`\`

**Best Practice**: Always include state management from the beginning - it's much harder to add later!`
    },
    {
      id: "tools",
      title: "Tools",
      completed: false,
      content: `# Advanced n8n Tools and Techniques

Master the powerful toolkit that makes n8n workflows incredibly flexible and capable.

## Essential n8n Nodes

### Data Transformation Nodes

**Set Node**: Modify and structure your data
\`\`\`javascript
// Transform email data
{
  "emailId": "{{$node['Gmail'].json['id']}}",
  "subject": "{{$node['Gmail'].json['subject']}}",
  "sender": "{{$node['Gmail'].json['from']}}",
  "receivedAt": "{{new Date().toISOString()}}",
  "priority": "{{$node['AI Agent'].json['priority']}}"
}
\`\`\`

**Code Node**: Custom JavaScript logic
\`\`\`javascript
// Extract invoice amount from email
const emailBody = $input.first().json.body;
const amountRegex = /\$([0-9,]+\.?[0-9]*)/g;
const amounts = emailBody.match(amountRegex);

return [{ 
  json: { 
    originalBody: emailBody,
    extractedAmounts: amounts,
    totalAmount: amounts ? amounts[0] : null
  }
}];
\`\`\`

**Function Node**: Reusable functions
\`\`\`javascript
// Reusable email validation function
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

const emails = $input.all().map(item => ({
  ...item.json,
  isValidEmail: validateEmail(item.json.email)
}));

return emails.map(email => ({ json: email }));
\`\`\`

### Control Flow Nodes

**IF Node**: Conditional logic
- [ ] Route emails based on sender domain
- [ ] Process different email types differently
- [ ] Handle business hours vs. after-hours emails

**Switch Node**: Multiple condition routing
\`\`\`javascript
// Route by email category
switch($node['AI Agent'].json['category']) {
  case 'urgent':
    return 0; // Route to urgent handler
  case 'billing':
    return 1; // Route to billing team
  case 'support':
    return 2; // Route to support queue
  default:
    return 3; // Route to general processing
}
\`\`\`

**Merge Node**: Combine data streams
- **Append**: Add items to the end
- **Merge by Index**: Combine items at same position
- **Merge by Key**: Join items with matching keys

## Advanced Workflow Patterns

### 1. Fan-Out/Fan-In Pattern

Process emails in parallel, then combine results:

\`\`\`
Gmail Trigger
    ↓
Split (by category)
    ↓ ↓ ↓
    AI Analysis | Spam Check | Priority Score
    ↓ ↓ ↓
Merge Node
    ↓
Final Processing
\`\`\`

### 2. Circuit Breaker Pattern

Prevent workflow failures from cascading:

\`\`\`javascript
// Circuit breaker logic
const errorCount = await $input.first().json.errorCount || 0;
const threshold = 5;

if (errorCount >= threshold) {
  // Circuit is open - don't process
  return [{ json: { status: 'circuit_open', bypass: true } }];
}

// Circuit is closed - proceed normally
return [{ json: { status: 'circuit_closed', proceed: true } }];
\`\`\`

### 3. Saga Pattern

Handle complex multi-step processes with rollback capability:

\`\`\`javascript
// Saga step tracking
const sagaSteps = [
  'validateEmail',
  'extractData', 
  'callExternalAPI',
  'updateDatabase',
  'sendNotification'
];

// Track completion and enable rollback
let completedSteps = $input.first().json.completedSteps || [];
let currentStep = $input.first().json.currentStep || sagaSteps[0];
\`\`\`

## Error Handling and Monitoring

### Comprehensive Error Handling

\`\`\`javascript
try {
  // Main workflow logic
  const result = await processEmail($input.first().json);
  
  return [{ 
    json: { 
      success: true, 
      result: result,
      timestamp: new Date().toISOString()
    } 
  }];
  
} catch (error) {
  // Error handling
  return [{ 
    json: { 
      success: false, 
      error: error.message,
      stack: error.stack,
      input: $input.first().json,
      timestamp: new Date().toISOString()
    } 
  }];
}
\`\`\`

### Monitoring and Alerting

**Webhook Node**: Real-time notifications
- [ ] Send alerts to Slack/Discord
- [ ] Create tickets in issue tracking systems
- [ ] Update external monitoring dashboards

**HTTP Request Node**: External integrations
- [ ] Log to external monitoring services
- [ ] Update CRM systems
- [ ] Trigger other automation platforms

## Performance Optimization

### Batch Processing

\`\`\`javascript
// Process emails in batches
const batchSize = 10;
const emails = $input.all();
const batches = [];

for (let i = 0; i < emails.length; i += batchSize) {
  batches.push(emails.slice(i, i + batchSize));
}

return batches.map(batch => ({ json: { emails: batch } }));
\`\`\`

### Caching Strategies

\`\`\`javascript
// Simple in-memory cache
const cache = {};
const cacheKey = \`user_\${$input.first().json.email}\`;

if (cache[cacheKey]) {
  return [{ json: cache[cacheKey] }];
}

// Process and cache result
const result = await processUser($input.first().json);
cache[cacheKey] = result;

return [{ json: result }];
\`\`\`

## Testing and Debugging

### Test Data Generation

\`\`\`javascript
// Generate test emails
const testEmails = Array.from({length: 5}, (_, i) => ({
  json: {
    id: \`test_\${i}\`,
    subject: \`Test Email \${i + 1}\`,
    from: \`test\${i}@example.com\`,
    body: \`This is test email body \${i + 1}\`,
    timestamp: new Date().toISOString()
  }
}));

return testEmails;
\`\`\`

### Debug Logging

\`\`\`javascript
// Comprehensive debug logging
console.log('=== DEBUG START ===');
console.log('Input:', JSON.stringify($input.all(), null, 2));
console.log('Node:', $node.name);
console.log('Execution ID:', $executionId);
console.log('=== DEBUG END ===');
\`\`\`

**Congratulations!** You've completed the n8n workshop. You now have the skills to build sophisticated automation workflows! 🎉`
    }
  ]
}