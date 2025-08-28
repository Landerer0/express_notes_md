import { Router } from "express";
import { checkGrammar, renderMarkdownToHtml } from "../controllers/utilsController";

const router = Router();

// POST /api/utils/checkGrammar
router.post("/checkGrammar", checkGrammar);

// POST /api/utils/renderMarkdownToHtml
router.post("/renderMarkdownToHtml", renderMarkdownToHtml);

export default router;
