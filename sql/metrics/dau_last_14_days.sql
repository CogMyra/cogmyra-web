SELECT date(created_at) AS day,
       COUNT(DISTINCT user_id) AS dau
FROM events
GROUP BY day
ORDER BY day DESC
LIMIT 14;
