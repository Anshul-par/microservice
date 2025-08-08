import { NatsListener } from "@ansh0712/common/build/events/base-listener";
import { TicketCreatedEvent } from "@ansh0712/common/build/events/events";
import { Subject } from "@ansh0712/common/build/events/subject";
import { Message } from "node-nats-streaming";
import { TicketModel } from "../models/ticket.model";

export class TicketCreatedListener extends NatsListener<TicketCreatedEvent> {
  subject: Subject.TicketCreated = Subject.TicketCreated;
  queueGroupName: string = Subject.TicketCreated.split(":").join("-");

  async onMessage(
    data: TicketCreatedEvent["data"],
    msg: Message
  ): Promise<void> {
    const ticket = data;

    await TicketModel.create({
      ...ticket,
    });

    console.log(`OrderService: Ticket created with id ${ticket.id}`);

    msg.ack();

    console.log(`OrderService: Ack for ticket created ${ticket.id}`);
  }
}
