import { NatsPublisher } from "@ansh0712/common/build/events/base-publisher";
import { Subject } from "@ansh0712/common/build/events/subject";
import { TicketUpdatedEvent } from "@ansh0712/common/build/events/events";

export class TicketUpdatedPublisher extends NatsPublisher<TicketUpdatedEvent> {
  subject: Subject.TicketUpdated = Subject.TicketUpdated;
  queueGroupName = Subject.TicketUpdated.split(":").join("-"); // Assuming queue group name is derived from the subject
}
