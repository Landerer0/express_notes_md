// authService.ts
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { findUserByEmail, createUser, findRefreshTokenByUserId, clearRefreshTokens, saveRefreshToken } from '../repositories/authRepository';

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;
const FIFTEEN_MINUTES_IN_S = 15 * 60;
const ONE_DAY_IN_S = 24 * 60 * 60;

const generateTokens = (userId: string) => {
  const accessToken = jwt.sign({ userId }, JWT_SECRET, { expiresIn: FIFTEEN_MINUTES_IN_S });
  const refreshToken = jwt.sign({ userId }, JWT_REFRESH_SECRET, { expiresIn: ONE_DAY_IN_S });
  return { accessToken, refreshToken };
};

export const registerUser = async (email: string, password: string) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return await createUser(email, hashedPassword);
};

export const loginUser = async (email: string, password: string) => {
  const user = await findUserByEmail(email);
  if (!user) throw new Error("User not found");

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) throw new Error("Wrong password");

  const { accessToken, refreshToken } = generateTokens(user.id);

  return { accessToken, refreshToken, user };
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET) as { userId: string };
};

export const verifyRefreshToken = async (refreshToken: string, userId: string) => {
  const tokenFromDb = await findRefreshTokenByUserId(userId);
  if (!tokenFromDb) throw new Error("No refresh token found");

  const isMatchToken = await bcrypt.compare(refreshToken, tokenFromDb.tokenHash);
  if (!isMatchToken) throw new Error("Invalid refresh token");

  return jwt.verify(refreshToken, JWT_REFRESH_SECRET) as { userId: string };
};

export const verifyAndRotateRefreshToken = async (refreshToken: string) => {
  const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as { userId: string };

  const tokenFromDb = await findRefreshTokenByUserId(decoded.userId);
  if (!tokenFromDb) throw new Error("Refresh token not found");

  const isMatch = await bcrypt.compare(refreshToken, tokenFromDb.tokenHash);
  if (!isMatch) throw new Error("Invalid refresh token");

  const accessToken = jwt.sign({ userId: decoded.userId }, JWT_SECRET, { expiresIn: FIFTEEN_MINUTES_IN_S });
  const newRefreshToken = jwt.sign({ userId: decoded.userId }, JWT_REFRESH_SECRET, { expiresIn: ONE_DAY_IN_S });

  const hashedNewRefresh = await bcrypt.hash(newRefreshToken, 12);

  await clearRefreshTokens(decoded.userId);
  await saveRefreshToken(decoded.userId, hashedNewRefresh);

  return { accessToken, newRefreshToken };
};
