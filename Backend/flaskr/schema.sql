DROP TABLE IF EXISTS ship;

CREATE TABLE ship (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  classification TEXT,
  latitude REAL,
  longitude REAL,
  img TEXT,
  width REAL,
  height REAL,
  confidence REAL,
  time REAL,
  danger INTEGER
);