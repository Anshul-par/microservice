import nats from "node-nats-streaming";

console.clear();

const stan = nats.connect(
  "nats-ticketing",
  `sub_${Math.random().toString(36).substring(2, 15)}`,
  {
    url: "http://localhost:4222",
  }
);

const options = stan.subscriptionOptions().setManualAckMode(true);

stan.on("connect", () => {
  console.log("Subscriber connected to NATS");

  stan.on("close", () => {
    console.log("NATS connection closed");
    process.exit();
  });

  const subscription = stan.subscribe(
    "ticket:created",
    "order-service-queue-group",
    options
  );

  subscription.on("message", (msg) => {
    console.log(`Received message: ${msg.getData()}`);
    console.log(`Message ID: ${msg.getSequence()}`);
    console.log(`Timestamp: ${msg.getTimestamp()}`);
  });
});

process.on("SIGINT", () => stan.close());
process.on("SIGTERM", () => stan.close());
