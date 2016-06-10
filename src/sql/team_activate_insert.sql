INSERT INTO slack_team (
  token,
  slack_id,
  oauth_payload,
  is_active
)
VALUES (
  ${token},
  ${teamId},
  ${payload},
  true
)
