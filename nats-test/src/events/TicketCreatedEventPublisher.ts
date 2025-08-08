import { NatsPublisher } from "@ansh0712/common/build/events/base-publisher";
import { TicketCreatedEvent } from "@ansh0712/common/build/events/events";
import { Subject } from "@ansh0712/common/build/events/subject";

export class TicketCreatedEventPublisher extends NatsPublisher<TicketCreatedEvent> {
  subject: Subject.TicketCreated = Subject.TicketCreated;
}
