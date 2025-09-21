import { Request, Response } from "express";
import { StatusCodes, ReasonPhrases } from "http-status-codes";
import * as noteService from "../services/noteService";
import {
  serializeNote,
  serializeUserWithNotes,
  serializeUserNotes,
} from "../utils/serializer";
import { SharedPermission } from "../generated/prisma";

export const getAllNotes = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const notes = await noteService.getAllUserNotes(userId);
    res.json(notes);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({
        error: ReasonPhrases.INTERNAL_SERVER_ERROR,
        message: "Failed to fetch notes",
      });
  }
};

export const getUserAndSharedNotes = async (req: Request, res: Response) => {
  const userId = req.userId;
  const userNotes = await noteService.getAllUserNotes(userId);
  res.status(StatusCodes.ACCEPTED).json({
    message: ReasonPhrases.ACCEPTED,
    result: serializeUserNotes(userNotes),
  });
};

export const getUserNotes = async (req: Request, res: Response) => {
  const userId = req.userId;
  const userNotes = await noteService.getAllNotesByUser(userId);
  res.status(StatusCodes.ACCEPTED).json({
    message: ReasonPhrases.ACCEPTED,
    result: serializeUserWithNotes(userNotes),
  });
};

export const getNote = async (req: Request, res: Response) => {
  const { noteId } = req.params;
  if (!noteId) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: ReasonPhrases.BAD_REQUEST,
      message: "No noteId provided",
    });
  }

  const note = await noteService.getNoteById(noteId);

  if (note === null) {
    return res.status(StatusCodes.NOT_FOUND).json({
      error: ReasonPhrases.NOT_FOUND,
      message: "Note with id " + noteId + " not found",
    });
  }

  res.status(StatusCodes.ACCEPTED).json({
    message: ReasonPhrases.ACCEPTED,
    result: serializeNote(note),
  });
};

export const getNotesTitlePdf = async (req: Request, res: Response) => {
  try {
    const notes = await noteService.getAllNotes();
    const pdfBuffer = await noteService.generateNotesPDF(notes);

    let pdfFilename;
    if (req.query.filename) {
      pdfFilename = req.query.filename;
    } else {
      pdfFilename = "Notes_Titles";
    }

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${pdfFilename}".pdf`
    );
    res.status(StatusCodes.OK).send(pdfBuffer); // Decidir si dejarlo así o cambiarlo por un json con el binario
  } catch (error) {
    console.error("Error al generar PDF:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: ReasonPhrases.INTERNAL_SERVER_ERROR,
      error: "Error al generar el PDF",
    });
  }
};

export const createNote = async (req: Request, res: Response) => {
  const { title, content } = req.body;
  const userId = req.userId;

  if (!title) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: StatusCodes.BAD_REQUEST,
      message: "Title is required",
    });
  }

  const newNote = await noteService.createNote(userId, title, content);
  res.status(StatusCodes.CREATED).json({
    message: ReasonPhrases.CREATED,
    result: serializeNote(newNote),
  });
};

export const updateNote = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, content } = req.body;

  if (!id) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: ReasonPhrases.BAD_REQUEST,
      message: "No id provided",
    });
  }

  if (!title && !content) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: ReasonPhrases.BAD_REQUEST,
      message: "No title or content provided",
    });
  }

  const updatedNote = await noteService.updateNote(id, title, content);
  if (updatedNote === null) {
    return res.status(StatusCodes.NOT_FOUND).json({
      error: ReasonPhrases.NOT_FOUND,
      message: "Note with id " + id + " not found",
    });
  }
  res.status(StatusCodes.OK).json({
    message: ReasonPhrases.OK,
    result: serializeNote(updatedNote),
  });
};

export const deleteNote = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: ReasonPhrases.BAD_REQUEST,
      message: "No id provided",
    });
  }
  const noteDeleted = await noteService.deleteNote(id);

  if (noteDeleted === false) {
    return res.status(StatusCodes.NOT_FOUND).json({
      error: ReasonPhrases.NOT_FOUND,
      message: "Note with id " + id + " not found",
    });
  }
  if (noteDeleted === true) {
    return res.status(StatusCodes.NO_CONTENT).send();
  }
};

export const shareNote = async (req: Request, res: Response) => {
  const { noteId } = req.params;
  const { userId, permission, expiresAt } = req.body;
  const grantedBy = req.userId;

  if (!noteId || !userId || !permission) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: ReasonPhrases.BAD_REQUEST,
      message: "noteId, userId and permission are required",
    });
  }

  const sharedNote = await noteService.shareNote(
    noteId,
    userId,
    grantedBy,
    permission as SharedPermission,
    expiresAt ? new Date(expiresAt) : undefined
  );

  res.status(StatusCodes.CREATED).json({
    message: "Note shared successfully",
    result: serializeNote(sharedNote),
  });
};

export const revokeShare = async (req: Request, res: Response) => {
  const { noteId } = req.params;
  const { userId } = req.body;

  if (!noteId || !userId) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: ReasonPhrases.BAD_REQUEST,
      message: "noteId y userId are required",
    });
  }

  const revoked = await noteService.revokeShare(noteId, userId);

  if (!revoked) {
    return res.status(StatusCodes.NOT_FOUND).json({
      error: ReasonPhrases.NOT_FOUND,
      message: "No shared note found to revoke",
    });
  }

  res.status(StatusCodes.OK).json({
    message: "Revoked access to note",
  });
};

export const getSharedNotesForUser = async (req: Request, res: Response) => {
  const userId = req.userId;

  const sharedNotes = await noteService.getSharedNotesForUser(userId);

  res.status(StatusCodes.OK).json({
    message: ReasonPhrases.OK,
    result: serializeNote(sharedNotes),
  });
};
