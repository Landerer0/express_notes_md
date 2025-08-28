import fs from "fs";
import { Note } from "../models/note";
import { NoteRepository } from "./noteRepository";
import { randomUUID } from "crypto";

const DB_FILE = "data/notes.json";

function ensureFileExist() {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, "[]");
  }
}

// Converts raw object (string dates) → domain (Date)
function parseNote(raw: any): Note {
  return {
    ...raw,
    createdAt: new Date(raw.createdAt),
    updatedAt: new Date(raw.updatedAt),
  };
}

// Converts Domain (Date) → persistence (string)
function serializeNote(note: Note): any {
  return {
    ...note,
    createdAt: note.createdAt.toISOString(),
    updatedAt: note.updatedAt.toISOString(),
  };
}

export const noteRepositoryJSON: NoteRepository = {
  async getAll() {
    ensureFileExist();
    const raw = fs.readFileSync(DB_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    return parsed.map(parseNote);
  },

  async getById(id: string) {
    const notes = await this.getAll();
    return notes.find((note) => note.id === id) || null;
  },

  async save(data: { title: string; content: string }) {
    const notes = await this.getAll();
    const note: Note = {
      id: randomUUID(),
      title: data.title,
      content: data.content,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    notes.push(note);
    fs.writeFileSync(
      DB_FILE,
      JSON.stringify(notes.map(serializeNote), null, 2)
    );
    return note;
  },

  async update(id: string, data: { title?: string; content?: string }) {
    let notes = await this.getAll();
    const note = notes.find((n) => n.id === id);
    if (!note) return null;

    if (data.title) note.title = data.title;
    if (data.content) note.content = data.content;
    note.updatedAt = new Date();

    fs.writeFileSync(
      DB_FILE,
      JSON.stringify(notes.map(serializeNote), null, 2)
    );
    return note;
  },

  async delete(id: string) {
    let notes = await this.getAll();
    const initialLength = notes.length;
    notes = notes.filter((note) => note.id !== id);
    fs.writeFileSync(
      DB_FILE,
      JSON.stringify(notes.map(serializeNote), null, 2)
    );
    return notes.length < initialLength;
  },
};
