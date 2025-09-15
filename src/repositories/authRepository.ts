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
