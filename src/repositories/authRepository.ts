import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

export const findUserByEmail = async (email: string) => {
  try{
    return await prisma.user.findUnique({ where: { email } });
  } catch(error){
    console.log(error)
    throw error
  }
};

export const createUser = async (email: string, hashedPassword: string) => {
  return await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
    },
  });
};

export const saveRefreshToken = async (userId: string, hashedToken: string) => {
  return await prisma.refreshToken.create({
    data: {
      userId,
      tokenHash: hashedToken,
    },
  });
};

export const findRefreshTokenByUserId = async (userId: string) => {
  return await prisma.refreshToken.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" }, // el más reciente
  });
};

export const clearRefreshTokens = async (userId: string) => {
  return await prisma.refreshToken.deleteMany({
    where: { userId },
  });
};
