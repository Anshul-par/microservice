import nats from "node-nats-streaming";

const stan = nats.connect("nats-ticketing", "pub", {
  url: "http://localhost:4222",
});

stan.on("connect", () => {
  console.log("Publisher connected to NATS");

  const data = JSON.stringify({
    id: "123456",
    title: "Concert Ticket",
    price: 20,
  });

  const subject = "ticket:created";

  stan.publish(subject, data, (err, guid) => {
    if (err) {
      console.error("Error publishing event:", err);
    } else {
      console.log(`Event published with guid: ${guid}`);
    }
  });
});
