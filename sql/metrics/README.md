# CogMyra Metrics SQL Library

Each `.sql` file in this folder defines a reusable query for analytics and monitoring via Cloudflare D1.

- `recent_events_50.sql` – shows the latest 50 events
- `dau_last_14_days.sql` – daily active users (distinct user_id)
- `events_last_14_days.sql` – total events per day
- `top_modes_last_14_days.sql` – most active modes (from payload)
- `events_by_path.sql` – most visited paths
- `invalid_json_events.sql` – invalid payloads (for debugging)
- `artifacts_recent_200.sql` – most recent artifact entries
- `artifacts_last_30_days.sql` – artifact records from past 30 days
