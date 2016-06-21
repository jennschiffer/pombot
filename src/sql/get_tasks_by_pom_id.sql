SELECT t.description, u.name
FROM pom_task AS t
INNER JOIN slack_user AS u ON u.id=t.slack_user_id
WHERE t.pom_id = ${pomId}
