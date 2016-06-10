UPDATE slack_team
SET is_active = true, oauth_payload = ${payload}
WHERE token = ${token}
