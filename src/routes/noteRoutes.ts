import { Router } from 'express';
import * as noteController from '../controllers/noteController';

const router = Router();

// /api/notes
router.get('/', noteController.getNotes);
router.get('/pdf',noteController.getNotesTitlePdf)
router.get('/:id', noteController.getNote);
router.post('/', noteController.createNote);
router.put('/:id', noteController.updateNote);
router.delete('/:id', noteController.deleteNote);

export default router;
