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
ON CONFLICT (token)
DO UPDATE SET (
  oauth_payload,
  is_active
) = (
  ${payload},
  true
)
