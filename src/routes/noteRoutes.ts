import { Router } from "express";
import * as noteController from "../controllers/noteController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

// /api/notes
//router.get("/", authMiddleware, noteController.getNotes);
router.get("/", authMiddleware, noteController.getUserNotes);
router.get("/pdf", authMiddleware, noteController.getNotesTitlePdf);
router.get("/:id", authMiddleware, noteController.getNote);
router.post("/", authMiddleware, noteController.createNote);
router.put("/:id", authMiddleware, noteController.updateNote);
router.delete("/:id", authMiddleware, noteController.deleteNote);

export default router;
