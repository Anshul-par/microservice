import { Message } from "node-nats-streaming";
import { NatsListener } from "@ansh0712/common/build/events/base-listener";
import { Subject } from "@ansh0712/common/build/events/subject";
import { TicketCreatedEvent } from "@ansh0712/common/build/events/events";

export class TicketCreatedEventListener extends NatsListener<TicketCreatedEvent> {
  subject: Subject.TicketCreated = Subject.TicketCreated;
  queueGroupName = Subject.TicketCreated.split(":").join("-");

  async onMessage(
    data: TicketCreatedEvent["data"],
    msg: Message
  ): Promise<void> {
    console.log("Event data! ", data);

    msg.ack();
  }
}
