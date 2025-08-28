import { randomUUID } from "crypto";
import { Note } from "../models/note";
import { noteRepository } from "../repositories/noteRepository";

export const getAllNotes = (): Note[] => {
  return noteRepository.getAll();
};

export const getNoteById = (id: string): Note | undefined => {
  return noteRepository.getById(id);
};

export const createNote = (title: string, content: string): Note => {
  const newNote: Note = {
    id: randomUUID(),
    title,
    content,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  noteRepository.save(newNote);
  return newNote;
};

export const updateNote = (
  id: string,
  title?: string,
  content?: string
): Note | undefined => {
  const note = noteRepository.getById(id);
  if (!note) return undefined;

  if (title !== undefined) note.title = title;
  if (content !== undefined) note.content = content;
  note.updatedAt = new Date();

  noteRepository.update(note);
  return note;
};

export const deleteNote = (id: string): boolean => {
  const note = noteRepository.getById(id);
  if (!note) return false;

  noteRepository.delete(id);
  return true;
};
