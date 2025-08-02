import jwt, { SignOptions, VerifyErrors, JwtPayload } from "jsonwebtoken";

console.log("JWT_SECRET:", process.env.jwt_secret);

export const generateJWT = (
  payload: JwtPayload,
  options?: SignOptions
): string => {
  try {
    const token = jwt.sign(payload, process.env.jwt_secret as string, {
      ...options,
    });
    return token;
  } catch (error) {
    throw new Error(`Error generating JWT: ${(error as Error).message}`);
  }
};

export const verifyJWT = (token: string): JwtPayload => {
  try {
    if (!process.env.jwt_secret) {
      throw new Error("JWT_SECRET is not defined");
    }
    const decoded = jwt.verify(token, process.env.jwt_secret) as JwtPayload;
    return decoded;
  } catch (error) {
    throw new Error(`Error verifying JWT: ${(error as VerifyErrors).message}`);
  }
};
