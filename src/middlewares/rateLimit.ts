import rateLimit from "express-rate-limit"

const FIFTEEN_MINUTES_IN_MS = 15 * 60 * 1000;
const MAX_LOGIN_ATTEMPTS = 5;
const MAX_REFRESH_ATTEMPTS = 20;

export const loginLimiter = rateLimit({
  windowMs: FIFTEEN_MINUTES_IN_MS,
  max: MAX_LOGIN_ATTEMPTS,
  message: {
    error: "Too many login attempts. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const refreshLimiter = rateLimit({
  windowMs: FIFTEEN_MINUTES_IN_MS,
  max: MAX_REFRESH_ATTEMPTS,
  message: {
    error: "Too many refresh attempts. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});