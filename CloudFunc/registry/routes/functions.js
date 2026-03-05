const express = require("express");
const pool = require("../db");

const router = express.Router();

/*
  Register a function (metadata only)
  Gateway builds the Docker image first,
  then calls this endpoint to store metadata.
*/
router.post("/", async (req, res) => {
  const { name, imageName, runtime } = req.body;

  if (!name || !imageName) {
    return res.status(400).json({
      error: "name and imageName are required"
    });
  }

  try {
    const result = await pool.query(
      `
      INSERT INTO functions (name, image_name, runtime)
      VALUES ($1, $2, $3)
      RETURNING *
      `,
      [name, imageName, runtime || "nodejs"]
    );

    return res.status(201).json({
      message: "Function registered",
      function: result.rows[0]
    });

  } catch (err) {

    // duplicate function
    if (err.code === "23505") {
      return res.status(409).json({
        error: "Function already exists"
      });
    }

    console.error("Function registration error:", err);

    return res.status(500).json({
      error: "Internal server error"
    });
  }
});


/*
  Get function metadata
  Worker uses this to know which Docker image to run
*/
router.get("/:name", async (req, res) => {

  try {
    const result = await pool.query(
      `SELECT * FROM functions WHERE name = $1`,
      [req.params.name]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Function not found"
      });
    }

    return res.json(result.rows[0]);

  } catch (err) {
    console.error("Function lookup error:", err);

    return res.status(500).json({
      error: "Internal server error"
    });
  }

});

module.exports = router;