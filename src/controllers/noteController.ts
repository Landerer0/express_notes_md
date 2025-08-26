import { Request, Response } from 'express';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';
import * as noteService from '../services/noteService';

export const getNotes = (req: Request, res: Response) => {
  const notes = noteService.getAllNotes()
  res.status(StatusCodes.ACCEPTED).json({
    message: ReasonPhrases.ACCEPTED,
    notes: notes
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
  
  // Se podria implementar aqui un retorno distinto si note es undefined

  res.status(StatusCodes.ACCEPTED).json({ 
    message: ReasonPhrases.ACCEPTED,
    note: note
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
    note: newNote
  })
};

export const updateNote = (req: Request, res: Response) => {
  const {id, title, content} = req.params
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

  noteService.updateNote(id,title,content)

  res.send('updateNote placeholder');
};

export const deleteNote = (req: Request, res: Response) => {
  res.send('deleteNote placeholder');
};
