"""Development intake event receiver. Do not send real customer data before provider auth is implemented."""
import hashlib
import hmac
import json
import os
import re
from datetime import datetime, timezone

import boto3
from botocore.exceptions import ClientError

TABLE = boto3.resource("dynamodb").Table(os.environ["TABLE_NAME"])
TOKEN = os.environ["INTAKE_TOKEN"]
ALLOWED = {"received", "running", "succeeded", "failed", "canceled"}
ID_PATTERN = re.compile(r"^[A-Za-z0-9_-]{1,80}$")


def response(status, data):
    return {"statusCode": status, "headers": {"Content-Type": "application/json", "Cache-Control": "no-store"}, "body": json.dumps(data)}


def lambda_handler(event, context):
    headers = {str(k).lower(): str(v) for k, v in (event.get("headers") or {}).items()}
    provided = headers.get("authorization", "")
    expected = "Bearer " + TOKEN
    if not hmac.compare_digest(provided, expected):
        return response(401, {"error": "unauthorized"})

    if event.get("isBase64Encoded"):
        return response(400, {"error": "unsupported_encoding"})
    raw = event.get("body") or ""
    if len(raw.encode("utf-8")) > 8192:
        return response(413, {"error": "payload_too_large"})
    try:
        body = json.loads(raw)
    except (TypeError, ValueError):
        return response(400, {"error": "invalid_json"})
    if not isinstance(body, dict):
        return response(400, {"error": "invalid_body"})

    customer = body.get("customer_id")
    automation = body.get("automation_id")
    run = body.get("execution_id")
    status = body.get("status", "received")
    if not all(isinstance(x, str) and ID_PATTERN.fullmatch(x) for x in (customer, automation, run)):
        return response(400, {"error": "invalid_ids"})
    if status not in ALLOWED:
        return response(400, {"error": "invalid_status"})

    # No names, emails, calendar descriptions, OAuth tokens or other PII in this table.
    now = datetime.now(timezone.utc).isoformat()
    item = {
        "pk": f"TENANT#{customer}#AUTOMATION#{automation}",
        "sk": f"RUN#{run}",
        "customer_id": customer,
        "automation_id": automation,
        "execution_id": run,
        "status": status,
        "recorded_at": now,
        "event_hash": hashlib.sha256(raw.encode("utf-8")).hexdigest(),
    }
    try:
        TABLE.put_item(Item=item, ConditionExpression="attribute_not_exists(pk) AND attribute_not_exists(sk)")
    except ClientError as exc:
        if exc.response["Error"]["Code"] == "ConditionalCheckFailedException":
            return response(200, {"accepted": True, "duplicate": True, "execution_id": run})
        raise
    return response(202, {"accepted": True, "duplicate": False, "execution_id": run})
