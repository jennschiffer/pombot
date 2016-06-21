INSERT INTO slack_channel (
  slack_id,
  slack_team_id,
  name
)
VALUES (
  ${slack_channel_id},
  ${slack_team_id},
  ${name}
)
RETURNING id
