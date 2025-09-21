import { Router } from "express";
import { checkGrammar, renderMarkdownHtml } from "../controllers/utilsController";

const router = Router();

// /api/utils
router.post("/check-grammar", checkGrammar);
router.post("/render-markdown-html", renderMarkdownHtml);

export default router;
