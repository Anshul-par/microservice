import { StatusCodes } from "http-status-codes";
import { NextFunction, Request, Response } from "express";
import { APIError } from "../errors/apiError";

export const errorMiddleware = (
  err: Error | APIError,
  _: Request,
  res: Response,
  __: NextFunction
) => {
  console.log(err);

  if (err instanceof APIError) {
    return res
      .status(err.statusCode)
      .json({ message: err.message, success: false });
  }

  res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json({ internalError: true, message: err.message });
};
