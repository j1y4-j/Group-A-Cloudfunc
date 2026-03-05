const express = require("express");
const functionsRouter = require("./routes/functions");
const jobsRouter = require("./routes/jobs");

const app = express();
app.use(express.json());
app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});

app.use("/functions", functionsRouter);
app.use("/jobs", jobsRouter);

app.listen(3000, () => console.log("Registry running"));
