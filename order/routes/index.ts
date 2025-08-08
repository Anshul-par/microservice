import express, { Request, Response } from "express";
import { validateReqSchema } from "../middlewares/validateReqSchema";
import { APIError } from "../errors/apiError";
import { StatusCodes } from "http-status-codes";
import { TicketModel } from "../models/ticket.model";
import { validateUser } from "../middlewares/validateUser";
import { order_creation_validate, param_id_validate } from "../validators";
import { OrderModel } from "../models/order.model";
import { OrderCreatedPublisher } from "../publisher/orderCreatedPublisher";
import { natsWrapper } from "../utility/nats-wrapper";

export const rootRouter = express.Router();

const EXPIRATION_WINDOW_SECONDS = 15 * 60; // 15 minutes in seconds

rootRouter.post(
  "/",
  validateUser,
  validateReqSchema(order_creation_validate),
  async (req: Request, res: Response) => {
    const { ticketId } = req.body;

    const ticket = await TicketModel.findById(ticketId);
    if (!ticket) {
      throw new APIError(StatusCodes.NOT_FOUND, "Ticket not found");
    }

    const isTicketReserved = await OrderModel.findOne({
      ticketId,
      status: { $in: ["created", "awaiting:payment", "complete"] },
    });

    if (isTicketReserved) {
      throw new APIError(StatusCodes.BAD_REQUEST, "Ticket is already reserved");
    }

    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    const order = await OrderModel.create({
      ticketId: ticket._id,
      expiresAt: expiration,
      userId: req.user.id,
    });

    new OrderCreatedPublisher(natsWrapper.instance()).publish({
      id: order._id.toString(),
      userId: order.userId.toString(),
      status: order.status,
      expiresAt: order.expiresAt,
      ticketId: {
        id: ticket._id.toString(),
        price: ticket.price,
        title: ticket.title,
      },
    });

    return res.status(StatusCodes.CREATED).json({
      message: "Order created successfully",
      success: true,
      data: { ...order.toObject() },
    });
  }
);
rootRouter.patch(
  "/cancel/:id",
  validateUser,
  validateReqSchema(param_id_validate),
  async (req: Request, res: Response) => {
    const id = req.params.id;

    let order = await OrderModel.findById(id).lean();
    if (!order) {
      throw new APIError(StatusCodes.NOT_FOUND, "Order not found");
    }

    if (order.status === "canceled") {
      throw new APIError(StatusCodes.BAD_REQUEST, "Order is already canceled");
    }

    if (order.status === "complete") {
      throw new APIError(StatusCodes.BAD_REQUEST, "Order is already complete");
    }

    if (order.userId.toString() !== req.user.id) {
      throw new APIError(
        StatusCodes.UNAUTHORIZED,
        "You are not authorized to cancel this order"
      );
    }

    order = await OrderModel.findByIdAndUpdate(
      id,
      {
        status: "canceled",
      },
      {
        new: true,
      }
    ).lean();

    return res.status(StatusCodes.OK).json({
      message: "Order cancelled successfully",
      success: true,
      data: { ...order },
    });
  }
);

rootRouter.get("/", validateUser, async (req: Request, res: Response) => {
  const user = req.user.id;
  const orders = await OrderModel.find({ userId: user }).lean();
  return res.status(StatusCodes.OK).json({
    message: "Orders fetched successfully",
    data: orders,
    success: true,
  });
});
rootRouter.get(
  "/:id",
  validateReqSchema(param_id_validate),
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const order = await OrderModel.findById(id).populate("ticketId").lean();

    if (!order) {
      throw new APIError(StatusCodes.NOT_FOUND, "Order not found");
    }

    return res.status(StatusCodes.OK).json({
      message: "Order fetched successfully",
      success: true,
      data: { ...order },
    });
  }
);
