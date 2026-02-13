const express = require("express");
const app = express();
app.use(express.json());

app.patch("/jobs/:id", (req, res) => {
  console.log(`Registry updated job ${req.params.id}:`, req.body);
  res.json({ status: req.body.status });
});

app.listen(8080, () => console.log("Registry mock running on port 8080"));
