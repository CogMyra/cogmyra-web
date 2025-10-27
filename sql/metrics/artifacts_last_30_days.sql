SELECT id,
       user_id,
       substr(content, 1, 2000) AS content,
       created_at
FROM artifacts
WHERE created_at >= date('now', '-30 days')
ORDER BY created_at DESC;
