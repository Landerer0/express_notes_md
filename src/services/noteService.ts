import { Note } from "../models/note";
import { NoteRepository } from "../repositories/noteRepository";
import PDFDocument from "pdfkit";

export const getAllNotes = async (): Promise<Note[]> => {
  return await NoteRepository.getAll();
};

export const getNoteById = async (id: string): Promise<Note | null> => {
  return await NoteRepository.getById(id);
};

export const getAllNotesByUser = async (userId: string) => {
  return await NoteRepository.getAllNotesByUser(userId);
};

export const createNote = async (
  userId: string,
  title: string,
  content: string
): Promise<Note> => {
  return await NoteRepository.save({ userId, title, content });
};

export const updateNote = async (
  id: string,
  title?: string,
  content?: string
): Promise<Note | null> => {
  return await NoteRepository.update(id, { title, content });
};

export const deleteNote = async (id: string): Promise<boolean> => {
  return await NoteRepository.delete(id);
};

export const generateNotesPDF = async (notes: Note[]): Promise<Buffer> => {
  const doc = new PDFDocument();
  const buffers: Buffer[] = [];

  doc.on("data", (chunk) => buffers.push(chunk));
  doc.on("end", () => {});

  doc.fontSize(16).text("Note titles", { underline: true });
  doc.moveDown();

  notes.forEach((note, index) => {
    doc.fontSize(12).text(`${index + 1}. ${note.title}`);
  });

  doc.end();

  return new Promise((resolve) => {
    doc.on("end", () => {
      const pdfBuffer = Buffer.concat(buffers);
      resolve(pdfBuffer);
    });
  });
};
