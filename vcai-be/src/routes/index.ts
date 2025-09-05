import { Router } from "express";
import initPromptRoute from "@/routes/init-prompt.route";

const router = Router();

router.use("/init-prompt", initPromptRoute);

export default router;
