import fs from "fs";
import path from "path";
import { Note } from "../models/note";

const DB_FILE = path.join(__dirname, "../../data/notes.json");

function ensureFileExist() {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify([]));
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

export const noteRepository = {
  getAll(): Note[] {
    ensureFileExist();
    const raw = fs.readFileSync(DB_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    return parsed.map(parseNote);
  },

  getById(id: string): Note | undefined {
    return this.getAll().find((note) => note.id === id);
  },

  save(note: Note): void {
    const notes = this.getAll();
    notes.push(note);
    fs.writeFileSync(DB_FILE, JSON.stringify(notes.map(serializeNote), null, 2));
  },

  update(updatedNote: Note): void {
    let notes = this.getAll();
    notes = notes.map((note) =>
      note.id === updatedNote.id ? updatedNote : note
    );
    fs.writeFileSync(DB_FILE, JSON.stringify(notes.map(serializeNote), null, 2));
  },

  delete(id: string): void {
    let notes = this.getAll();
    notes = notes.filter((note) => note.id !== id);
    fs.writeFileSync(DB_FILE, JSON.stringify(notes.map(serializeNote), null, 2));
  },
};
