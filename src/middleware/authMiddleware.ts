import { Request, Response, NextFunction } from "express";
import { StatusCodes, ReasonPhrases } from "http-status-codes";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.token;

  if (!token)
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ error: ReasonPhrases.UNAUTHORIZED });

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    req.userId = decoded.userId;
    next();
  } catch {
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ error: ReasonPhrases.UNAUTHORIZED, message: "Invalid token" });
  }
};
