import { NoteRepository } from "./noteRepository";
import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

export const noteRepositorySQLite: NoteRepository = {
  async getAll() {
    return prisma.note.findMany();
  },

  async getById(id: string) {
    return prisma.note.findUnique({ where: { id } });
  },

  async save(data: { title: string; content: string }) {
    return prisma.note.create({
      data: {
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
