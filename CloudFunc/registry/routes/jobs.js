const express = require("express");
const pool = require("../db");

const router = express.Router();

router.post("/", async (req, res) => {
  const { jobId, functionName, payload } = req.body;

  if (!jobId || !functionName) {
    return res.status(400).json({
      error: "jobId and functionName are required"
    });
  }

  // Check function exists
  const func = await pool.query(
    "SELECT 1 FROM functions WHERE name = $1",
    [functionName]
  );

  if (func.rows.length === 0) {
    return res.status(404).json({
      error: "Function does not exist"
    });
  }

  try {
    const result = await pool.query(
      `INSERT INTO jobs (job_id, function_name, payload, status)
       VALUES ($1, $2, $3, 'queued')
       RETURNING *`,
      [jobId, functionName, JSON.stringify(payload)]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === "23505") { // unique violation
      return res.status(409).json({
        error: "Job with this jobId already exists"
      });
    }
    res.status(500).json({ error: "Internal server error" });
  }
});

const allowedTransitions = {
  queued: ["running"],
  running: ["completed", "failed"]
};



router.get("/:jobId", async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM jobs WHERE job_id = $1",
    [req.params.jobId]
  );
  if (result.rows.length === 0)
    return res.status(404).json({ error: "Job not found" });
  res.json(result.rows[0]);
});

router.patch("/:jobId", async (req, res) => {
  const { status, result, error } = req.body;

  if (!status) {
    return res.status(400).json({
      error: "status is required"
    });
  }

  const current = await pool.query(
    "SELECT status FROM jobs WHERE job_id = $1",
    [req.params.jobId]
  );

  if (current.rows.length === 0) {
    return res.status(404).json({ error: "Job not found" });
  }

  const currentStatus = current.rows[0].status;

  if (
    allowedTransitions[currentStatus] &&
    !allowedTransitions[currentStatus].includes(status)
  ) {
    return res.status(400).json({
      error: `Invalid status transition from ${currentStatus} to ${status}`
    });
  }

  const completedAt =
    status === "completed" || status === "failed"
      ? new Date()
      : null;

  const response = await pool.query(
    `UPDATE jobs
     SET status=$1, result=$2, error=$3, completed_at=$4
     WHERE job_id=$5
     RETURNING *`,
    [status, result, error, completedAt, req.params.jobId]
  );

  res.json(response.rows[0]);
});


module.exports = router;
