import * as express from "express";
import { authenticateToken } from "../middlewares/auth.middleware.js";
import {
  getGlobalContext,
  setGlobalContext,
  deleteGlobalContext,
} from "../controllers/globalContext.controller.js";

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// GET /api/v1/global-context - Get all global context items
router.get("/", getGlobalContext);

// POST /api/v1/global-context - Add or update a global context item
router.post("/", setGlobalContext);

// DELETE /api/v1/global-context/:key - Delete a global context item
router.delete("/:key", deleteGlobalContext);

export default router;