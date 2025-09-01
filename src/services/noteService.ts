import { Note } from "../models/note";
import { NoteRepository } from "../repositories/noteRepository";
import { noteRepositoryJSON } from "../repositories/noteRepositoryJSON";
import { noteRepositorySQLite } from "../repositories/noteRepositorySQLite";
import PDFDocument from "pdfkit";

const repository: NoteRepository =
  process.env.USE_SQLITE === "true" ? noteRepositorySQLite : noteRepositoryJSON;

export const getAllNotes = async (): Promise<Note[]> => {
  return await repository.getAll();
};

export const getNoteById = async (id: string): Promise<Note | null> => {
  return await repository.getById(id);
};

export const createNote = async (
  title: string,
  content: string
): Promise<Note> => {
  return await repository.save({ title, content });
};

export const updateNote = async (
  id: string,
  title?: string,
  content?: string
): Promise<Note | null> => {
  return await repository.update(id, { title, content });
};

export const deleteNote = async (id: string): Promise<boolean> => {
  return await repository.delete(id);
};

export const generateNotesPDF = async (notes: Note[]): Promise<Buffer> => {
  const doc = new PDFDocument();
  const buffers: Buffer[] = [];

  doc.on("data", (chunk) => buffers.push(chunk));
  doc.on("end", () => {});

  doc.fontSize(16).text("Títulos de las Notas", { underline: true });
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
