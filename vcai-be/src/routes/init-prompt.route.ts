import { Router } from "express";
import { getInitPromptController } from "@/controllers/init-prompt.controller";

const router = Router();

router.get("/", getInitPromptController);

export default router;
