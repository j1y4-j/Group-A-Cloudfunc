require("dotenv").config();
const express = require("express");
const axios = require("axios");
const amqp = require("amqplib");
const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 8080;
const REGISTRY_URL = process.env.REGISTRY_URL || "http://localhost:3000";
const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://localhost";

let channel;

async function startServer() {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    channel = await connection.createChannel();
    await channel.assertQueue("executions");

    console.log("✅ Connected to RabbitMQ");

    app.listen(PORT, () => {
      console.log(`🚀 Gateway running on port ${PORT}`);
    });

  } catch (err) {
    console.error("RabbitMQ connection error:", err.message);
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
    await axios.get(`${REGISTRY_URL}/functions/${functionName}`);

    // 2️⃣ Create job in Registry
    await axios.post(`${REGISTRY_URL}/jobs`, {
      jobId,
      functionName,
      payload
    });

    // 3️⃣ Publish job to RabbitMQ
    channel.sendToQueue(
      "executions",
      Buffer.from(
        JSON.stringify({
          jobId,
          functionName,
          payload
        })
      )
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
      `${REGISTRY_URL}/jobs/${req.params.jobId}`
    );
    res.json(response.data);
  } catch (error) {
    if (error.response) {
      return res.status(error.response.status).json(error.response.data);
    }

    res.status(500).json({ error: "Gateway error retrieving job" });
  }
});

startServer();