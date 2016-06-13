INSERT INTO pom (
  slack_channel_id,
  started_at
)
VALUES (
  (SELECT id FROM slack_channel WHERE slack_id=${slack_channel_id}),
  CURRENT_TIMESTAMP
)
RETURNING id
