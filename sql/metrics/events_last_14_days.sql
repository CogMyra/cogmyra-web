SELECT date(created_at) AS day,
       COUNT(*) AS events
FROM events
GROUP BY day
ORDER BY day DESC
LIMIT 14;
