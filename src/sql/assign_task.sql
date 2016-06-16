INSERT INTO pom_task (
  pom_id,
  slack_user_id,
  description
)
VALUES (
  ${pomId},
  ${userSlackId},
  ${message}
)
ON CONFLICT (pom_id, slack_user_id)
DO UPDATE
SET description = ${message}
RETURNING id
