UPDATE pom
SET is_completed = true
WHERE id = ${pomId}
RETURNING (SELECT EXTRACT (EPOCH FROM (length - (CURRENT_TIMESTAMP - started_at))))
