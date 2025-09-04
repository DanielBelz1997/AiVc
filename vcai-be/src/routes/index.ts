import { Router } from "express";

const router = Router();

// Example API route
router.get("/", (req, res) => {
  res.json({
    message: "API is working!",
    endpoints: [
      "GET /api/health",
      "GET /api/users",
      // Add more endpoints as you build them
    ],
  });
});

// Health check for API
router.get("/health", (req, res) => {
  res.json({
    status: "API OK",
    timestamp: new Date().toISOString(),
  });
});

export default router;
