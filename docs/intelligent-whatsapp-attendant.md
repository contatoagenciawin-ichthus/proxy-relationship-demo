# Intelligent WhatsApp Attendant

This document defines the target architecture represented by the controlled WhatsApp + AI demo.

## Product role

The intelligent attendant is not a standalone chatbot. It is an operational agent connected to the relationship platform.

Its responsibilities are:

- understand natural-language messages;
- identify the person/company when possible;
- recover CRM and conversation history;
- classify intent, urgency and commercial context;
- retrieve approved operational knowledge;
- suggest or send responses according to autonomy;
- execute only explicitly authorized tools/actions;
- preserve a complete audit trail;
- transfer to a human with context when necessary.

## Execution model

```
WhatsApp / Meta
  ↓
Inbound event
  ↓
Identity resolution
  ↓
Conversation + CRM context
  ↓
Policy / autonomy layer
  ↓
Reasoning + tool selection
  ↓
Approved tool execution
  ↓
Response / human handoff
  ↓
Audit + metrics
```

## Autonomy levels

### Level 1 — Assistant

The model can analyze context and draft responses.

It cannot send messages or mutate operational records.

### Level 2 — Supervised

The model can prepare responses and actions, but actions with side effects require explicit human approval.

### Level 3 — Assisted operation

The model can execute pre-authorized low-risk actions, for example:

- classify the conversation;
- update CRM interest/status;
- create a task;
- open a support ticket;
- create a commercial opportunity;
- request missing information;
- route to an authorized queue.

Sensitive actions still require approval.

### Level 4 — Operational autonomy

The model can complete defined end-to-end workflows inside configured boundaries.

This level must be opt-in per tenant and per tool/action.

## Policy layer

Each tenant must define:

### May do

Examples:

- answer approved FAQs;
- retrieve non-sensitive account context;
- create opportunities;
- create tasks;
- classify requests;
- schedule a callback.

### Requires approval

Examples:

- send a commercial proposal;
- grant discounts;
- change committed dates;
- cancel or reschedule critical appointments;
- send documents containing sensitive data.

### Never do

Examples:

- invent price or delivery commitments;
- expose another customer's data;
- bypass authentication requirements;
- delete audit records;
- execute tools not enabled for the tenant.

## Human handoff

Handoff should happen when:

- the user asks for a person;
- confidence is below the configured threshold;
- the topic is outside the knowledge/policy boundary;
- negotiation exceeds allowed limits;
- complaint/escalation rules are triggered;
- an action requires approval;
- a tool or source fails.

The human must receive:

- conversation summary;
- identified intent;
- customer/company identity;
- relevant history;
- actions already performed;
- unresolved question;
- recommended next step.

## Memory model

Memory should not be a free-form model memory.

The agent should read structured, auditable sources such as:

- contact/company records;
- previous conversations;
- opportunities;
- service tickets;
- orders/quotes;
- appointments;
- documents explicitly made available to the agent;
- tenant knowledge base.

Write operations must be explicit tool calls.

## Recommended tool interface

Each operational action should be a typed tool with:

- tenant scope;
- required permission;
- input schema;
- validation;
- idempotency where applicable;
- audit event;
- clear failure behavior.

Examples:

```
get_contact_context
get_company_context
get_recent_conversations
search_knowledge
create_opportunity
update_contact_interest
create_support_ticket
create_task
request_human_handoff
send_whatsapp_message
```

## WhatsApp integration

Production should consume WhatsApp Business Platform webhook events and normalize them into internal conversation events.

The intelligent layer should never depend directly on UI state.

Outbound messaging must respect:

- tenant authorization;
- Meta/WhatsApp messaging rules;
- template requirements when applicable;
- opt-in/consent state;
- rate and abuse controls;
- auditability.

## Demo versus production

The public demo intentionally simulates analysis, response generation and actions.

It must not:

- send WhatsApp messages;
- create real CRM records;
- execute paid model calls without explicit limits;
- expose customer data.

A private tenant demo may enable controlled live capabilities.

## Next production milestone

The first real milestone should be a Level 2/3 agent connected to one controlled tenant:

1. WhatsApp inbound webhook;
2. identity resolution;
3. CRM history retrieval;
4. intent classification;
5. response suggestion;
6. low-risk tool execution;
7. human handoff;
8. audit log.

LA CRM is a suitable reference implementation because its operational workflow already includes WhatsApp, leads, service progression and CRM state.
