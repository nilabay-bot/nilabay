# nilabay intake and operations foundation

This is a **development foundation**, not a deployed, customer-ready intake service. No AWS, Google, Bedrock, ClickUp, or email integration is live in this branch.

## Architecture

Google Calendar Appointment Scheduling stays on the existing website. A future authorized Google Calendar sync adapter will detect booked appointments and submit sanitized run events. The event receiver is AWS SAM + API Gateway + Lambda + DynamoDB. The customer-facing dashboard is a separate static **sample-data-only** preview at /automation-demo.html.

Do not submit names, email addresses, appointment details, OAuth credentials, or any protected health information through the event receiver. Do not put real customer data into the public demo.

## Deployment prerequisites

AWS CLI and SAM CLI, dedicated AWS development account, MFA, budget alarms, API Gateway usage plan/API key, and secure secret storage. The template requires an IntakeToken and an API key at the API boundary; API key issuance and Google OAuth are not yet automated. Never put the IntakeToken on a public web page or in git.

```sh
cd automation
sam build
sam deploy --guided
```

Until the API key/usage plan and a trusted event source are configured, **do not expose this endpoint for production traffic**. Replace the shared-token model with verified Google notification + OAuth access and proper authorization before onboarding any customer.

## Example event contract (non-PII)

```json
{
  "customer_id": "nilabay",
  "automation_id": "consultation-intake",
  "execution_id": "synthetic-run-001",
  "status": "received"
}
```

The handler validates allowed statuses and IDs, uses a conditional write for at-most-once ingestion per execution ID, and records the event timestamp. Current implementation stores the *initial* event per execution; implementing authenticated status transitions and reliable event versioning comes next.

## Next implementation milestones

1. Set up AWS and secure secret management, API auth, API usage plan, WAF/rate limiting, logging/alarms and IAM boundaries.
2. Connect Google Calendar with OAuth read-only scopes, initial full sync + syncToken incremental sync; handle cancellations, reschedules and token invalidation.
3. Store private lead/contact records in a separate encrypted datastore with strict access controls and retention policy.
4. Introduce Step Functions and ClickUp lead creation with retry/idempotency; Bedrock briefing drafts only after privacy review.
5. Add Cognito, scoped tenant authorization and authenticated dashboard API. Keep public demo synthetic.
6. Test and deploy before describing the workflow as live or publishing performance claims.
