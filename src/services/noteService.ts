// Aquí irá la lógica de negocio más adelante
// Por ahora exportamos funciones vacías para evitar errores

import { randomUUID } from 'crypto';
import { Note } from '../models/note';


let notes: Note[] = [];

export const getAllNotes = () => {
    return notes;
};

export const getNoteById = (id: string): Note | undefined => {
  return notes.find(note => note.id === id);
};

export const createNote = (title: string, content: string): Note => {
    const newNote: Note = {
        id: randomUUID(),
        title,
        content,
        createdAt: new Date(),
        updatedAt: new Date()
    };
    notes.push(newNote);
    return newNote;
};

export const updateNote = (id: string, title: string, content: string): Note | undefined => {
    const note = getNoteById(id)
    if(note === undefined) return null
    if(title !== undefined) note.title = title 
    if(content !== undefined) note.content = content
    return note;
};

export const deleteNote = (id: string) => {
    return false;
};
