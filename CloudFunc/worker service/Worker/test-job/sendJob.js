const amqp = require("amqplib");

async function sendTestJob() {
  const conn = await amqp.connect("amqp://localhost:5672");
  const ch = await conn.createChannel();
  await ch.assertQueue("executions", { durable: true });

  const job = {
    jobId: "test123",
    functionName: "add",
    payload: { a: 1, b: 2 }
  };

  ch.sendToQueue("executions", Buffer.from(JSON.stringify(job)));
  console.log("Test job sent!");
  await ch.close();
  await conn.close();
}

sendTestJob();
