import express, { Request, Response } from "express";
import { validateReqSchema } from "../middlewares/validateReqSchema";
import { APIError } from "../errors/apiError";
import { StatusCodes } from "http-status-codes";
import { TicketModel } from "../models/ticket.model";
import { validateUser } from "../middlewares/validateUser";
import {
  param_id_validate,
  ticket_creation_validate,
  ticket_update_validate,
} from "../validators";

export const rootRouter = express.Router();

rootRouter.post(
  "/",
  validateUser,
  validateReqSchema(ticket_creation_validate),
  async (req: Request, res: Response) => {
    const payload = req.body;

    const ticket = await TicketModel.create({
      ...payload,
      userId: req.user.id,
    });

    return res.status(StatusCodes.CREATED).json({
      message: "Ticket created successfully",
      success: true,
      data: { ...ticket.toObject() },
    });
  }
);
rootRouter.patch(
  "/:id",
  validateUser,
  validateReqSchema(ticket_update_validate),
  async (req: Request, res: Response) => {
    const payload = req.body;
    const id = req.params.id;

    const ticket = await TicketModel.findById(id);

    if (!ticket) {
      throw new APIError(StatusCodes.NOT_FOUND, "Ticket not found");
    }

    if (req.user.id !== ticket.userId.toString()) {
      throw new APIError(
        StatusCodes.FORBIDDEN,
        "You are not authorized to update this ticket"
      );
    }

    await TicketModel.findByIdAndUpdate(id, payload, {
      new: true,
    });

    return res.status(StatusCodes.CREATED).json({
      message: "Ticket updated successfully",
      success: true,
      data: { ...ticket.toObject() },
    });
  }
);
rootRouter.delete(
  "/:id",
  validateUser,
  validateReqSchema(param_id_validate),
  async (req: Request, res: Response) => {
    const id = req.params.id;

    const ticket = await TicketModel.findById(id);
    if (!ticket) {
      throw new APIError(StatusCodes.NOT_FOUND, "Ticket not found");
    }
    if (req.user.id !== ticket.userId.toString()) {
      throw new APIError(
        StatusCodes.FORBIDDEN,
        "You are not authorized to delete this ticket"
      );
    }

    await TicketModel.findByIdAndDelete(id, {
      new: true,
    });

    if (!ticket) {
      throw new APIError(StatusCodes.NOT_FOUND, "Ticket not found");
    }

    return res.status(StatusCodes.CREATED).json({
      message: "Ticket deleted successfully",
      success: true,
      data: { ...ticket.toObject() },
    });
  }
);

rootRouter.get("/", async (req: Request, res: Response) => {
  const ticket = await TicketModel.find({}).lean();
  return res
    .status(StatusCodes.OK)
    .json({ message: "Welcome to the Auth API", data: ticket, success: true });
});
rootRouter.get(
  "/:id",
  validateReqSchema(param_id_validate),
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const ticket = await TicketModel.findById(id).lean();

    if (!ticket) {
      throw new APIError(StatusCodes.NOT_FOUND, "Ticket not found");
    }

    return res.status(StatusCodes.OK).json({
      message: "Ticket fetched successfully",
      success: true,
      data: { ...ticket },
    });
  }
);
