-- Function Registry
CREATE TABLE IF NOT EXISTS functions (
  name VARCHAR(255) PRIMARY KEY,
  image_name VARCHAR(255) NOT NULL,
  runtime VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Job Registry
CREATE TABLE IF NOT EXISTS jobs (
  job_id VARCHAR(36) PRIMARY KEY,
  function_name VARCHAR(255),
  payload TEXT,
  status VARCHAR(20),
  result TEXT,
  error TEXT,
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP,
  attempts INT DEFAULT 0
);
