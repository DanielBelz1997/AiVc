import { Request, Response } from "express";
import { initPromptService } from "@/services/init-prompt.service";

/**
 * @swagger
 * /api/init-prompt:
 *   get:
 *     summary: Get initial prompt
 *     description: Returns an initial prompt message for the application
 *     tags: [Prompts]
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InitPromptResponse'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
const getInitPromptController = async (req: Request, res: Response) => {
  try {
    const response = await initPromptService();
    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      message: "Failed to get initial prompt",
    });
  }
};

export { getInitPromptController };
