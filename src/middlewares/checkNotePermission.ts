import { Request, Response, NextFunction } from "express";
import * as NoteService from "../services/noteService";
import { SharedPermission } from "../generated/prisma";
import { StatusCodes, ReasonPhrases } from "http-status-codes";

export const requireNotePermission = (required: SharedPermission) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const noteId = req.params.noteId;
    const userId = req.userId;

    const hasPermission = await NoteService.checkPermission(
      noteId,
      userId,
      required
    );

    if (!hasPermission) {
      return res.status(StatusCodes.FORBIDDEN).json({
        error: ReasonPhrases.FORBIDDEN,
        message: "You do not have permission to access this note",
      });
    }

    next();
  };
};