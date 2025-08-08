import nats from "node-nats-streaming";
import { TicketCreatedEventListener } from "./events/TicketCreatedEventListener";

const stan = nats.connect(
  "nats-ticketing",
  `sub_${Math.random().toString(36).substring(2, 15)}`,
  {
    url: "http://localhost:4222",
  }
);

stan.on("connect", () => {
  console.log("Subscriber connected to NATS");

  const TicketCreatedListener = new TicketCreatedEventListener(stan);
  TicketCreatedListener.listen();

  stan.on("close", () => {
    console.log("NATS connection closed");
    process.exit();
  });
});

process.on("SIGINT", () => stan.close());
process.on("SIGTERM", () => stan.close());
