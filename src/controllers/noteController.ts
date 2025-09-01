import { Request, Response } from "express";
import { StatusCodes, ReasonPhrases } from "http-status-codes";
import * as noteService from "../services/noteService";

export const getNotes = async (req: Request, res: Response) => {
  const notes = await noteService.getAllNotes();
  res.status(StatusCodes.ACCEPTED).json({
    message: ReasonPhrases.ACCEPTED,
    result: notes,
  });
};

export const getNote = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: ReasonPhrases.BAD_REQUEST,
      message: "No id provided",
    });
  }

  const note = await noteService.getNoteById(id);

  if (note === null) {
    return res.status(StatusCodes.NOT_FOUND).json({
      error: ReasonPhrases.NOT_FOUND,
      message: "Note with id " + id + " not found",
    });
  }

  res.status(StatusCodes.ACCEPTED).json({
    message: ReasonPhrases.ACCEPTED,
    result: note,
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

  if (!title) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: StatusCodes.BAD_REQUEST,
      message: "Title is required",
    });
  }

  const newNote = await noteService.createNote(title, content);
  res.status(StatusCodes.CREATED).json({
    message: ReasonPhrases.CREATED,
    result: newNote,
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
    result: updatedNote,
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
