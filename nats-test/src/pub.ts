import nats from "node-nats-streaming";
import { TicketCreatedEventPublisher } from "./events/TicketCreatedEventPublisher";

const stan = nats.connect("nats-ticketing", "pub", {
  url: "http://localhost:4222",
});

stan.on("connect", async () => {
  console.log("Publisher connected to NATS");
  const ticketCreatedEventPublisher = new TicketCreatedEventPublisher(stan);

  await ticketCreatedEventPublisher.publish({
    id: "123456",
    title: "Concert Ticket",
    price: 20,
  });
});
