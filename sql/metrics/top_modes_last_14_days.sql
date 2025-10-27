SELECT json_extract(payload, '$.mode') AS mode,
       COUNT(*) AS count
FROM events
WHERE date(created_at) >= date('now','-14 days')
  AND json_extract(payload, '$.mode') IS NOT NULL
GROUP BY mode
ORDER BY count DESC
LIMIT 10;
