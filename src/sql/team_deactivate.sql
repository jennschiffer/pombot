UPDATE slack_team
SET is_active = false
WHERE token = ${token}
