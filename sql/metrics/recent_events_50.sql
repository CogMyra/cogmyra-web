SELECT id,
       type,
       path,
       created_at,
       substr(payload, 1, 200) AS payload_sample
FROM events
ORDER BY id DESC
LIMIT 50;
