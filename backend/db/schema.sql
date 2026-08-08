CREATE TABLE IF NOT EXISTS members (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  gender TEXT,
  dob TEXT,
  phone TEXT,
  emergency_contact TEXT,
  address TEXT,
  registration_date TEXT,
  status TEXT,
  expiry_date TEXT,
  plan TEXT,
  trainer TEXT,
  locker TEXT,
  medical_notes TEXT,
  last_updated TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS attendance (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  member_id TEXT NOT NULL,
  check_in TEXT,
  check_out TEXT,
  method TEXT,
  branch TEXT,
  recorded_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(member_id) REFERENCES members(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS payments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  member_id TEXT NOT NULL,
  payment_date TEXT,
  amount REAL,
  method TEXT,
  receipt TEXT,
  status TEXT,
  recorded_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(member_id) REFERENCES members(id) ON DELETE CASCADE
);
