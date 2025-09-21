import { Request, Response } from "express";
import {
  registerUser,
  loginUser,
  verifyAccessToken,
  verifyRefreshToken,
  verifyAndRotateRefreshToken,
} from "../services/authService";
import {
  findUserByEmail,
  saveRefreshToken,
  clearRefreshTokens,
} from "../repositories/authRepository";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import bcrypt from "bcryptjs";
import { serializeUser, serializeNote } from "../utils/serializer";

const FIFTEEN_MINUTES_IN_MS = 15 * 60 * 1000;
const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;

const ACCESS_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  maxAge: FIFTEEN_MINUTES_IN_MS,
};

const REFRESH_COOKIE_OPTIONS = {
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
      user: serializeUser(user),
    });
  } catch {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: ReasonPhrases.INTERNAL_SERVER_ERROR,
      message: "Error trying to register user",
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const { accessToken, refreshToken, user } = await loginUser(
      email,
      password
    );

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 12);
    await saveRefreshToken(user.id, hashedRefreshToken);
    res.cookie("refresh_token", refreshToken, REFRESH_COOKIE_OPTIONS);
    res.cookie("access_token", accessToken, ACCESS_COOKIE_OPTIONS);

    res.json({
      message: "User successfully logged in",
      user: serializeUser(user),
    });
  } catch (err: any) {
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ error: ReasonPhrases.UNAUTHORIZED, message: err.message });
  }
};

export const logout = (_req: Request, res: Response) => {
  res.clearCookie("access_token", ACCESS_COOKIE_OPTIONS);
  res.clearCookie("refresh_token", REFRESH_COOKIE_OPTIONS);
  res.json({ message: "User successfully logged out" });
};

export const refresh = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refresh_token;
  if (!refreshToken) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      error: ReasonPhrases.UNAUTHORIZED,
      message: "No refresh token provided",
    });
  }

  try {
    const { accessToken, newRefreshToken } = await verifyAndRotateRefreshToken(
      refreshToken
    );

    res.cookie("refresh_token", newRefreshToken, REFRESH_COOKIE_OPTIONS);
    res.cookie("access_token", accessToken, ACCESS_COOKIE_OPTIONS);

    res.json({ message: "Access token refreshed" });
  } catch {
    res.status(StatusCodes.UNAUTHORIZED).json({
      error: ReasonPhrases.UNAUTHORIZED,
      message: "Invalid refresh token",
    });
  }
};

export const verifySession = (req: Request, res: Response) => {
  const token = req.cookies.access_token;
  if (!token)
    return res.status(StatusCodes.UNAUTHORIZED).json({
      error: ReasonPhrases.UNAUTHORIZED,
      message: "Not authenticated",
    });

  try {
    const decoded = verifyAccessToken(token);
    res.json({ message: "Valid session", userId: decoded.userId });
  } catch {
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ error: ReasonPhrases.UNAUTHORIZED, message: "Invalid token" });
  }
};
