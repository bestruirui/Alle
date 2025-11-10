CREATE TABLE IF NOT EXISTS email (
  id INTEGER PRIMARY KEY,
  message_id TEXT UNIQUE,
  from_address TEXT,
  from_name TEXT,
  to_address TEXT,
  recipient TEXT,
  title TEXT,
  body_text TEXT,
  body_html TEXT,
  sent_at TEXT,
  received_at TEXT,
  email_type TEXT,
  email_result TEXT,
  email_result_text TEXT,
  email_error TEXT
);