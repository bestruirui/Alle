-- Email table
CREATE TABLE IF NOT EXISTS email (
  id INTEGER PRIMARY KEY,
  message_id TEXT UNIQUE,
  from_address TEXT,
  from_name TEXT,
  sender_address TEXT,
  to_address TEXT,
  recipient TEXT,
  subject TEXT,
  body_text TEXT,
  body_html TEXT,
  sent_at TEXT,
  received_at TEXT DEFAULT CURRENT_TIMESTAMP,
  verification_type TEXT,
  verification_code TEXT,
  verification_link TEXT,
  verification_used BOOLEAN,
  extract_result TEXT
);