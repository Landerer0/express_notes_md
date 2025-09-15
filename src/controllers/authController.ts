import { Request, Response } from "express";
import { registerUser, loginUser, verifyToken } from "../services/authService";
import { findUserByEmail } from "../repositories/authRepository";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  maxAge: ONE_DAY_IN_MS,
};

export const register = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const existingUser = await findUserByEmail(email);

    if (existingUser)
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: ReasonPhrases.BAD_REQUEST,
        message: "User already exists",
      });

    const user = await registerUser(email, password);
    res.status(StatusCodes.CREATED).json({
      message: ReasonPhrases.CREATED,
      user: { id: user.id, email: user.email },
    });
  } catch {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: ReasonPhrases.INTERNAL_SERVER_ERROR,
      message: "Error trying to register user",
    });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const { token, user } = await loginUser(email, password);
    res.cookie("token", token, COOKIE_OPTIONS);
    res.json({
      message: "User successfully logged in",
      user: { id: user.id, email: user.email },
    });
  } catch (err: any) {
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ error: ReasonPhrases.UNAUTHORIZED, message: err.message });
  }
};

export const logout = (_req: Request, res: Response) => {
  res.clearCookie("token", COOKIE_OPTIONS);
  res.json({ message: "User successfully logged out" });
};

export const verifySession = (req: Request, res: Response) => {
  const token = req.cookies.token;
  if (!token)
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ error: ReasonPhrases.UNAUTHORIZED, message: "Not authenticated" });

  try {
    const decoded = verifyToken(token);
    res.json({ message: "Valid session", userId: decoded.userId });
  } catch {
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ error: ReasonPhrases.UNAUTHORIZED, message: "Invalid token" });
  }
};
