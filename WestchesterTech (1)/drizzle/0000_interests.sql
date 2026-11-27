CREATE TABLE interests (
  email TEXT NOT NULL COLLATE NOCASE,
  role TEXT NOT NULL,
  name TEXT NOT NULL,
  organization TEXT NOT NULL,
  message TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (email, role)
);
