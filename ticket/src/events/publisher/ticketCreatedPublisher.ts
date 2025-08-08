import { NatsPublisher } from "@ansh0712/common/build/events/base-publisher";
import { Subject } from "@ansh0712/common/build/events/subject";
import { TicketCreatedEvent } from "@ansh0712/common/build/events/events";

export class TicketCreatedPublisher extends NatsPublisher<TicketCreatedEvent> {
  subject: Subject.TicketCreated = Subject.TicketCreated;
  queueGroupName = Subject.TicketCreated.split(":").join("-"); // Assuming queue group name is derived from the subject
}
