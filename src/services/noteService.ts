import { Note } from "../models/note";
import { NoteRepository } from "../repositories/noteRepository";
import { SharedPermission } from "../generated/prisma";
import PDFDocument from "pdfkit";

export const getAllUserNotes = async (userId: string) => {
  const ownedNotes = await NoteRepository.findOwnedNotes(userId)
  const sharedNotes = await NoteRepository.findSharedNotes(userId)

  return {
    owned: ownedNotes,
    shared: sharedNotes,
  }
}

export const getAllNotes = async (): Promise<Note[]> => {
  return await NoteRepository.getAllNotes()
}

export const getNoteById = async (id: string): Promise<Note | null> => {
  return await NoteRepository.getNoteById(id)
}

export const getAllNotesByUser = async (userId: string) => {
  return await NoteRepository.getAllNotesByUser(userId)
}

export const createNote = async (
  userId: string,
  title: string,
  content: string
): Promise<Note> => {
  return await NoteRepository.saveNote({ userId, title, content })
}

export const updateNote = async (
  id: string,
  title?: string,
  content?: string
): Promise<Note | null> => {
  return await NoteRepository.updateNote(id, { title, content })
}

export const deleteNote = async (id: string): Promise<boolean> => {
  return await NoteRepository.deleteNote(id)
}

export const generateNotesPDF = async (notes: Note[]): Promise<Buffer> => {
  const doc = new PDFDocument()
  const buffers: Buffer[] = []

  doc.on("data", (chunk) => buffers.push(chunk))
  doc.on("end", () => {})

  doc.fontSize(16).text("Note titles", { underline: true })
  doc.moveDown()

  notes.forEach((note, index) => {
    doc.fontSize(12).text(`${index + 1}. ${note.title}`)
  })

  doc.end()

  return new Promise((resolve) => {
    doc.on("end", () => {
      const pdfBuffer = Buffer.concat(buffers)
      resolve(pdfBuffer)
    })
  })
}

export const shareNote = async (
  noteId: string,
  userId: string,
  grantedBy: string,
  permission: SharedPermission,
  expiresAt?: Date
) => {
  return NoteRepository.shareNote(
    noteId,
    userId,
    grantedBy,
    permission,
    expiresAt
  )
}

export const revokeShare = async (noteId: string, userId: string) => {
  return NoteRepository.revokeShare(noteId, userId)
}

export const getSharedNotesForUser = async (userId: string) => {
  return NoteRepository.getSharedNotesForUser(userId)
}

export const checkPermission = async (
  noteId: string,
  userId: string,
  required: SharedPermission
) => {
  return NoteRepository.checkPermission(noteId, userId, required)
}


