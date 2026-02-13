const express = require("express");
const app = express();
app.use(express.json());

app.post("/execute", (req, res) => {
  console.log(`Container Manager executing job ${req.body.jobId}`);
  res.json({ output: "ok", success: true });
});

app.listen(8081, () => console.log("Container Manager mock running on port 8081"));
