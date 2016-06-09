-- create new pom and "start" it
INSERT INTO pom (slack_channel_id, started_at)
VALUES ($1, $2)
