import express, { Request, Response } from "express";
import { validateReqSchema } from "../middlewares/validateReqSchema";
import { signin_validate, signup_validate } from "../validators";
import { APIError } from "../errors/apiError";
import { StatusCodes } from "http-status-codes";
import { User } from "../models/user.model";
import { comparePasswords } from "../utility/password";
import { generateJWT } from "../utility/genJWT";
import { validateUser } from "../middlewares/validateUser";

export const rootRouter = express.Router();

rootRouter.get("/", (req: Request, res: Response) => {
  return res
    .status(StatusCodes.OK)
    .json({ message: "Welcome to the Auth API" });
});

rootRouter.post(
  "/sign-in",
  validateReqSchema(signin_validate),
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const ifUserExists = await User.findOne({ email });

    if (!ifUserExists) {
      throw new APIError(StatusCodes.NOT_FOUND, "User not found");
    }

    const isPasswordValid = await comparePasswords(
      ifUserExists.password,
      password
    );

    if (!isPasswordValid) {
      throw new APIError(StatusCodes.UNAUTHORIZED, "Invalid password");
    }

    const token = generateJWT({
      id: ifUserExists._id.toString(),
      email: ifUserExists.email,
    });

    req.session = {
      jwt: token,
    };

    return res.status(StatusCodes.OK).json({
      message: "User signed in successfully",
      success: true,
      data: { email, password },
    });
  }
);
rootRouter.post(
  "/sign-up",
  validateReqSchema(signup_validate),
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const ifUserExists = await User.findOne({ email });

    if (ifUserExists) {
      throw new APIError(StatusCodes.BAD_REQUEST, "User already exists");
    }

    const user = await User.create({
      email,
      password,
    });

    return res.status(StatusCodes.CREATED).json({
      message: "User created successfully",
      success: true,
      data: { ...user.toObject() },
    });
  }
);

rootRouter.get(
  "/current-user",
  validateUser,
  async (req: Request, res: Response) => {
    return res.status(StatusCodes.OK).json({
      message: "Current user",
      success: true,
      //@ts-ignore
      data: req.user || null,
    });
  }
);

rootRouter.post("/sign-out", (req: Request, res: Response) => {
  req.session = null; // Clear the session
  return res.status(StatusCodes.OK).json({
    message: "User signed out successfully",
    success: true,
  });
});
