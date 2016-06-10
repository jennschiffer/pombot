ALTER TABLE slack_team
ADD CONSTRAINT slack_team_token_key UNIQUE (token);

---

ALTER TABLE slack_team
DROP CONSTRAINT slack_team_token_key;
