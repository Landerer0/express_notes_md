import { Request, Response } from 'express';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';
import * as noteService from '../services/noteService';

export const getNotes = (req: Request, res: Response) => {
  const notes = noteService.getAllNotes()
  res.status(StatusCodes.ACCEPTED).json({
    message: ReasonPhrases.ACCEPTED,
    result: notes
  })
};

export const getNote = (req: Request, res: Response) => {
  const {id} = req.params
  if(!id){
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: ReasonPhrases.BAD_REQUEST,
      message: "No id provided"
    });
  }

  const note = noteService.getNoteById(id)
  
  if(note === undefined){
    return res.status(StatusCodes.NOT_FOUND).json({
      error: ReasonPhrases.NOT_FOUND,
      message: "Note with id "+id+" not found"
    })
  }

  res.status(StatusCodes.ACCEPTED).json({ 
    message: ReasonPhrases.ACCEPTED,
    result: note
  })
};

export const createNote = (req: Request, res: Response) => {
  const { title, content } = req.body

  if (!title) {
    return res.status(StatusCodes.BAD_REQUEST).json({ 
      error: StatusCodes.BAD_REQUEST, 
      message: 'Title is required' 
    })
  }

  const newNote = noteService.createNote(title, content);
  res.status(StatusCodes.CREATED).json({
    message: ReasonPhrases.CREATED,
    result: newNote
  })
};

export const updateNote = (req: Request, res: Response) => {
  const {id} = req.params
  const {title, content} = req.body

  if(!id){
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: ReasonPhrases.BAD_REQUEST,
      message: "No id provided"
    })
  }

  if(!title&&!content){
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: ReasonPhrases.BAD_REQUEST,
      message: "No title or content provided"
    })
  }

  const updatedNote = noteService.updateNote(id,title,content)
  if(updatedNote === undefined){
    return res.status(StatusCodes.NOT_FOUND).json({
      error: ReasonPhrases.NOT_FOUND,
      message: "Note with id "+id+" not found"
    })
  }
  res.status(StatusCodes.OK).json({
    message: ReasonPhrases.OK,
    result: updatedNote
  })

};

export const deleteNote = (req: Request, res: Response) => {
  const {id} = req.params
  if(!id){
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: ReasonPhrases.BAD_REQUEST,
      message: "No id provided"
    })
  }
  const noteDeleted = noteService.deleteNote(id)

  if(noteDeleted === false){
    return res.status(StatusCodes.NOT_FOUND).json({
      error: ReasonPhrases.NOT_FOUND,
      message: "Note with id "+id+" not found"
    })
  }
  if(noteDeleted === true){
    return res.status(StatusCodes.NO_CONTENT).send()
  }
};
