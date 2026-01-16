const express = require("express");
const axios = require("axios");

const app = express();
const PORT = 3000;

app.use(express.json());

function verifyJWT(req, res, next) {
  console.log("JWT verification placeholder");
  next();
}

app.post("/invoke", verifyJWT, async (req, res) => {
  try {
    const { functionName, payload } = req.body;

    if (!functionName || payload === undefined) {
      return res.status(400).json({
        error: "functionName and payload are required"
      });
    }

    console.log("Invoke request received:", functionName);

    const registryResponse = await axios.get(
      `http://localhost:4000/functions/${functionName}`
    );

    const imageName = registryResponse.data.image;

    if (!imageName) {
      return res.status(404).json({
        error: "Function exists but image not found"
      });
    }

    console.log("Resolved image:", imageName);

    const containerResponse = await axios.post(
      "http://localhost:5000/execute",
      {
        imageName,
        payload
      }
    );

    return res.status(200).json({
      functionName,
      result: containerResponse.data
    });

  } catch (error) {
    console.error("Gateway error:", error.message);

    if (error.response) {
      return res.status(error.response.status).json({
        error: error.response.data
      });
    }

    return res.status(500).json({
      error: "Internal Gateway Error"
    });
  }
});

app.get("/", (req, res) => {
  res.send("Gateway Service is running");
});

app.listen(PORT, () => {
  console.log(`Gateway Service running on port ${PORT}`);
});
