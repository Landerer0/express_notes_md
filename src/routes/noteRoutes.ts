import { Router } from "express";
import * as noteController from "../controllers/noteController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { requireNotePermission } from "../middlewares/checkNotePermission";

const router = Router();

// /api/notes
router.get("/", authMiddleware, noteController.getUserAndSharedNotes);
router.get("/getAllNotes", authMiddleware, noteController.getAllNotes);
router.get("/getUserNotes", authMiddleware, noteController.getUserNotes);
router.get("/pdf", authMiddleware, noteController.getNotesTitlePdf);
router.get("/:noteId", authMiddleware, requireNotePermission("VIEW"), noteController.getNote);
router.get("/shared/me", authMiddleware, noteController.getSharedNotesForUser);

router.post("/", authMiddleware, noteController.createNote);
router.post("/:noteId/share", authMiddleware, requireNotePermission("EDIT"), noteController.shareNote);
router.post("/:noteId/revoke", authMiddleware, requireNotePermission("EDIT"), noteController.revokeShare);

router.put("/:noteId", authMiddleware, requireNotePermission("EDIT"), noteController.updateNote);

router.delete("/:noteId", authMiddleware, requireNotePermission("EDIT"), noteController.deleteNote);


export default router;
