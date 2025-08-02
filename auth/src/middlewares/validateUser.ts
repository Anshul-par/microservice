import { NextFunction, Request, Response } from "express";
import { verifyJWT } from "../utility/genJWT";
import { APIError } from "../errors/apiError";
import { StatusCodes } from "http-status-codes";

declare global {
  namespace Express {
    interface Request {
      user?: any; // Adjust type as needed
    }
  }
}

export const validateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.session?.jwt;

  if (!token) {
    throw new APIError(
      StatusCodes.UNAUTHORIZED,
      "Unauthorized: No token provided"
    );
  }

  const decoded = verifyJWT(token);

  if (!decoded) {
    throw new APIError(StatusCodes.UNAUTHORIZED, "Unauthorized: Invalid token");
  }

  req.user = decoded;

  next();
};
