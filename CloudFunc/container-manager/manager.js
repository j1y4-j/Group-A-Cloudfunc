const express = require("express");
const Docker = require("dockerode");

const app = express();
const docker = new Docker(); 
const PORT = 4000;

// Test endpoint
app.get("/spawnTestContainer", async (req, res) => {
  let container;

  try {
    // 1. Create container
    container = await docker.createContainer({
      Image: "alpine",
      Cmd: ["echo", "Hello from CloudFunc"],
      Tty: false
    });

    // 2. Start container
    await container.start();

    // 3. Wait till command finishes
    await container.wait();

    // 4. Remove container
    await container.remove();

    res.json({
      message: "Container ran successfully",
      output: "Hello from CloudFunc"
    });

  } catch (error) {
    console.error(error)
    if (container) {
      await container.remove({ force: true });
    }
    res.status(500).json({ error: "Container execution failed" });
  }
});

app.listen(PORT, () => {
  console.log(`Container Manager running on port ${PORT}`);
});
