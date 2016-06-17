-- final alert, 300 seconds. test alert, 10 seconds
UPDATE pom
SET is_alerted=true
WHERE ((EXTRACT(EPOCH FROM (length - (CURRENT_TIMESTAMP - started_at)))) <= 10)
  AND (is_alerted IS false)
  AND (is_completed IS false)
RETURNING id, (EXTRACT(EPOCH FROM (length - (CURRENT_TIMESTAMP - started_at)))) AS seconds_remaining
