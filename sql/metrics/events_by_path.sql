SELECT path,
       COUNT(*) AS count
FROM events
WHERE path IS NOT NULL
GROUP BY path
ORDER BY count DESC
LIMIT 25;
