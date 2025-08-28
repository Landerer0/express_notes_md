import { Note } from "../models/note";

export interface NoteRepository {
  getAll(): Promise<Note[]>;
  getById(id: string): Promise<Note | null>;
  save(note: { title: string; content: string }): Promise<Note>;
  update(id: string, data: { title?: string; content?: string }): Promise<Note | null>;
  delete(id: string): Promise<boolean>;
}