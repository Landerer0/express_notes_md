import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

export const NoteRepository = {
  async getAll() {
    return prisma.note.findMany();
  },

  
  async getAllNotesByUser(userId: string){
    return await prisma.user.findUnique({
      where: { id: userId },
      include: { notes: true },
    })
  },

  async getById(id: string) {
    return prisma.note.findUnique({ where: { id } });
  },

  async save(data: { userId: string; title: string; content: string }) {
    return prisma.note.create({
      data: {
        userId: data.userId,
        title: data.title,
        content: data.content,
      },
    });
  },

  async update(id: string, data: { title?: string; content?: string }) {
    try {
      return await prisma.note.update({
        where: { id },
        data,
      });
    } catch {
      return null;
    }
  },

  async delete(id: string) {
    try {
      await prisma.note.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  },
};
