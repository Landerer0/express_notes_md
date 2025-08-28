import { Router } from "express";
import { checkGrammar, renderMarkdownToHtml } from "../controllers/utilsController";

const router = Router();

// /api/utils
router.post("/checkGrammar", checkGrammar);
router.post("/renderMarkdownToHtml", renderMarkdownToHtml);

export default router;
