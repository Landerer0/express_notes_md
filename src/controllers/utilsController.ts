import { Request, Response } from "express";
import * as utilsService from "../services/utilsService";
import { StatusCodes, ReasonPhrases } from "http-status-codes";

export const renderMarkdownToHtml = async (req: Request, res: Response) => {
  const { markdown } = req.body;
  if (!markdown) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: ReasonPhrases.BAD_REQUEST,
      message: "No markdown provided",
    });
  }

  try {
    const html = await utilsService.renderMarkdownToHtml(markdown);
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

export const checkGrammar = async (req: Request, res: Response) => {
  const { content, language } = req.body;
  if (!content) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: ReasonPhrases.BAD_REQUEST,
      message: "No content provided",
    });
  }

  try {
    const result = await utilsService.checkGrammarWithAPI(content, language);
    res.status(StatusCodes.OK).json({
      message: ReasonPhrases.OK,
      result: {
        original: content,
        result: result
      }});
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({
        error: ReasonPhrases.INTERNAL_SERVER_ERROR,
        message: error,
      });
  }
};

