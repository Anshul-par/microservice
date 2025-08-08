import { NatsPublisher } from "@ansh0712/common/build/events/base-publisher";
import { Subject } from "@ansh0712/common/build/events/subject";
import { OrderCancelledEvent } from "@ansh0712/common/build/events/events";

export class OrderCancelledPublisher extends NatsPublisher<OrderCancelledEvent> {
  subject: Subject.OrderCanceled = Subject.OrderCanceled;
  queueGroupName = Subject.OrderCanceled.split(":").join("-");
}
