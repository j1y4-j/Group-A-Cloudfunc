require("dotenv").config();
const express = require("express");
const axios = require("axios");
const amqp = require("amqplib");
const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(express.json());

const PORT = 8080;
let channel;

async function startServer() {
  try {
    const connection = await amqp.connect("amqp://localhost");
    channel = await connection.createChannel();
    await channel.assertQueue("executions");

    console.log("✅ Connected to RabbitMQ");

    app.listen(PORT, () => {
      console.log(`🚀 Gateway running on port ${PORT}`);
    });

  } catch (err) {
    console.error("RabbitMQ error:", err.message);
    process.exit(1);
  }
}

app.post("/invoke", async (req, res) => {
  const { functionName, payload } = req.body;

  if (!functionName || payload === undefined) {
    return res.status(400).json({
      error: "functionName and payload are required"
    });
  }

  try {
    const jobId = uuidv4();

    // 1️⃣ Verify function exists in Registry
    await axios.get(
      `http://localhost:3000/functions/${functionName}`
    );

    // 2️⃣ Create job in Registry
    await axios.post("http://localhost:3000/jobs", {
      jobId,
      functionName,
      payload,
      status: "queued"
    });

    // 3️⃣ Publish job to RabbitMQ
    channel.sendToQueue(
      "executions",
      Buffer.from(JSON.stringify({ jobId, functionName, payload }))
    );

    return res.status(200).json({ jobId });

  } catch (error) {
    console.error("Gateway error:", error.message);

    if (error.response) {
      return res.status(error.response.status).json(error.response.data);
    }

    return res.status(500).json({
      error: "Internal Gateway Error"
    });
  }
});

app.get("/jobs/:jobId", async (req, res) => {
  try {
    const response = await axios.get(
      `http://localhost:3000/jobs/${req.params.jobId}`
    );
    res.json(response.data);
  } catch {
    res.status(404).json({ error: "Job not found" });
  }
});

startServer();