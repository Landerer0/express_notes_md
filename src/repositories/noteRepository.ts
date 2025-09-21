import { PrismaClient, SharedPermission } from "../generated/prisma";

const prisma = new PrismaClient();

export const NoteRepository = {
  async getAllNotes() {
    return prisma.note.findMany();
  },

  async findOwnedNotes(userId: string) {
    return prisma.note.findMany({
      where: { userId },
    });
  },

  async findSharedNotes(userId: string) {
    return prisma.note.findMany({
      where: {
        sharedWith: {
          some: {
            userId,
            revokedAt: null,
            OR: [{ expiresAt: null }, { expiresAt: { gte: new Date() } }],
          },
        },
      },
    });
  },

  async getAllNotesByUser(userId: string) {
    return await prisma.user.findUnique({
      where: { id: userId },
      include: { notes: true },
    });
  },

  async getNoteById(id: string) {
    return prisma.note.findUnique({ where: { id } });
  },

  async saveNote(data: { userId: string; title: string; content: string }) {
    return prisma.note.create({
      data: {
        userId: data.userId,
        title: data.title,
        content: data.content,
      },
    });
  },

  async updateNote(id: string, data: { title?: string; content?: string }) {
    try {
      return await prisma.note.update({
        where: { id },
        data,
      });
    } catch {
      return null;
    }
  },

  async deleteNote(id: string) {
    try {
      await prisma.note.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  },

  async shareNote(
    noteId: string,
    userId: string,
    grantedBy: string,
    permission: SharedPermission,
    expiresAt?: Date
  ) {
    return await prisma.sharedNote.upsert({
      where: { noteId_userId: { noteId, userId } },
      update: { permission, grantedBy, expiresAt, revokedAt: null },
      create: { noteId, userId, grantedBy, permission, expiresAt },
    });
  },

  async revokeShare(noteId: string, userId: string) {
    return await prisma.sharedNote.updateMany({
      where: { noteId, userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  },

  async getSharedNotesForUser(userId: string) {
    return await prisma.sharedNote.findMany({
      where: { userId, revokedAt: null, expiresAt: { gte: new Date() } },
      include: { note: true },
    });
  },

  async checkPermission(
    noteId: string,
    userId: string,
    required: SharedPermission
  ): Promise<boolean> {
    const note = await prisma.note.findUnique({ where: { id: noteId } });

    const isNoteOwner = note?.userId === userId;
    if (isNoteOwner) return true;

    const sharedNote = await prisma.sharedNote.findFirst({
      where: {
        noteId,
        userId,
        revokedAt: null,
        OR: [{ expiresAt: null }, { expiresAt: { gte: new Date() } }],
      },
    });

    if (!sharedNote) return false;
    if (required === "VIEW") return true;
    if (required === "EDIT" && sharedNote.permission === "EDIT") return true;

    return false;
  },
};
