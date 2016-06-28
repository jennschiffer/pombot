INSERT INTO slack_channel (
  slack_id,
  slack_team_id
)
VALUES (
  ${slack_channel_id},
  ${slack_team_id}
)
RETURNING id
