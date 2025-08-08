import { NatsPublisher } from "@ansh0712/common/build/events/base-publisher";
import { Subject } from "@ansh0712/common/build/events/subject";
import { OrderCreatedEvent } from "@ansh0712/common/build/events/events";

export class OrderCreatedPublisher extends NatsPublisher<OrderCreatedEvent> {
  subject: Subject.OrderCreated = Subject.OrderCreated;
  queueGroupName = Subject.OrderCreated.split(":").join("-"); // Assuming queue group name is derived from the subject
}
