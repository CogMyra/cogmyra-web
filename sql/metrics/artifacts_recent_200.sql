SELECT id,
       user_id,
       substr(content, 1, 2000) AS content,
       created_at
FROM artifacts
ORDER BY created_at DESC
LIMIT 200;
