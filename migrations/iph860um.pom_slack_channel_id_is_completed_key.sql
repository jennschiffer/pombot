CREATE UNIQUE INDEX pom_slack_channel_id_is_completed_key ON pom(slack_channel_id) WHERE (is_completed IS false)
---
DROP INDEX pom_slack_channel_id_is_completed_key
