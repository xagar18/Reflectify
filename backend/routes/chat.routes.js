import express from "express";
import {
  addMessage,
  addMessages,
  createConversation,
  deleteAllConversations,
  deleteConversation,
  getConversation,
  getConversations,
  updateConversation,
} from "../controllers/chat.controller.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Conversation routes
router.post("/conversations", createConversation);
router.get("/conversations", getConversations);
router.get("/conversations/:id", getConversation);
router.put("/conversations/:id", updateConversation);
router.delete("/conversations/:id", deleteConversation);
router.delete("/conversations", deleteAllConversations);

// Message routes
router.post("/conversations/:conversationId/messages", addMessage);
router.post("/conversations/:conversationId/messages/bulk", addMessages);

export default router;
