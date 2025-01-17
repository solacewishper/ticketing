import {
  BadRequestError,
  Listener,
  OrderCancelledEvent,
  OrderStatus,
  Subjects,
} from "@sdgittickets/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queqeGroupName: string = queueGroupName;

  async onMessage(
    data: OrderCancelledEvent["data"],
    msg: Message,
  ): Promise<void> {
    const order = await Order.findOne({
      _id: data.id,
      version: data.version - 1,
    });

    if (!order) {
      throw new BadRequestError("There is no order with this id");
    }

    order.set({ status: OrderStatus.Cancelled });
    await order.save();

    msg.ack();
  }
}
