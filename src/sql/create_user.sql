INSERT INTO slack_user (
  slack_id,
  slack_team_id,
  name
)
VALUES (
  ${userSlackId},
  ${teamId},
  ${userName}
)
RETURNING id
