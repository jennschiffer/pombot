INSERT INTO pom (
  slack_channel_id
)
VALUES (
  (SELECT id FROM slack_channel WHERE slack_id=${slack_channel_id})
)
RETURNING id
