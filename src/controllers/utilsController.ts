import { Request, Response } from "express";
import * as utilsService from "../services/utilsService";
import { StatusCodes, ReasonPhrases } from "http-status-codes";

// ✅ Render Markdown → HTML
export const renderMarkdownToHtml = (req: Request, res: Response) => {
  const { markdown } = req.body;
  if (!markdown) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: ReasonPhrases.BAD_REQUEST,
      message: "No markdown provided",
    });
  }

  try {
    const html = utilsService.renderMarkdownToHtml(markdown);
    res.status(StatusCodes.OK).json({
      message: ReasonPhrases.OK,
      result: html,
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: ReasonPhrases.INTERNAL_SERVER_ERROR,
    });
  }
};

// ✅ Revisión de gramática
export const checkGrammar = async (req: Request, res: Response) => {
  const { content } = req.body;
  if (!content) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: ReasonPhrases.BAD_REQUEST,
      message: "No content provided",
    });
  }

  try {
    const result = await utilsService.checkGrammarWithAPI(content);
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({
        error: ReasonPhrases.INTERNAL_SERVER_ERROR,
        message: "Error checking grammar",
      });
  }
};
