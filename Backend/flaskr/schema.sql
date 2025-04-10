DROP TABLE IF EXISTS ship;

CREATE TABLE ship (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  lattitude INTEGER,
  longitude INTEGER,
  classification TEXT
);