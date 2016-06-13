SELECT p.id
FROM pom AS p
INNER JOIN slack_channel AS sc ON sc.id=p.slack_channel_id
WHERE p.is_completed IS false
AND sc.slack_id = ${slack_channel_id}
