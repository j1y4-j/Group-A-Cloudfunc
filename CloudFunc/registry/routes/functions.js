const express = require("express");
const pool = require("../db");


const router = express.Router();

router.post("/", async (req, res) => {
  const { name, imageName, runtime } = req.body;

  // Validation
  if (!name || !imageName) {
    return res.status(400).json({
      error: "name and imageName are required"
    });
  }

  try {
    const result = await pool.query(
      `INSERT INTO functions (name, image_name, runtime)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [name, imageName, runtime]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === "23505") { // unique violation
      return res.status(409).json({
        error: "Function already exists"
      });
    }
    res.status(500).json({ error: "Internal server error" });
  }
});


router.get("/:name", async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM functions WHERE name = $1",
    [req.params.name]
  );
  if (result.rows.length === 0)
    return res.status(404).json({ error: "Function not found" });
  res.json(result.rows[0]);
});

module.exports = router;
