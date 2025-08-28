import { Note } from "../models/note"
import { NoteRepository } from "../repositories/noteRepository"
import { noteRepositoryJSON } from "../repositories/noteRepositoryJSON"
import { noteRepositorySQLite } from "../repositories/noteRepositorySQLite"

const repository: NoteRepository =
  process.env.USE_SQLITE === "true" ? noteRepositorySQLite : noteRepositoryJSON

export const getAllNotes = async (): Promise<Note[]> => {
  return await repository.getAll()
};

export const getNoteById = async (id: string): Promise<Note | null> => {
  return await repository.getById(id)
};

export const createNote = async (
  title: string,
  content: string
): Promise<Note> => {
  return await repository.save({ title, content })
};

export const updateNote = async (
  id: string,
  title?: string,
  content?: string
): Promise<Note | null> => {
  return await repository.update(id, { title, content })
};

export const deleteNote = async (id: string): Promise<boolean> => {
  return await repository.delete(id)
};
