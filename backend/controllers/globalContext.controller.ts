import { Request, Response } from "express";
import prisma from "../prisma-client.js";

// Extend Request interface to include user property
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

// Get all global context items for the authenticated user
export const getGlobalContext = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;

    const globalContexts = await prisma.globalContext.findMany({
      where: {
        userId,
        isActive: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      globalContexts,
    });
  } catch (error) {
    console.error("Error fetching global context:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching global context",
    });
  }
};

// Add or update a global context item
export const setGlobalContext = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const { key, value, category } = req.body;

    if (!key || typeof key !== "string" || !key.trim()) {
      return res.status(400).json({
        success: false,
        message: "Key is required and must be a non-empty string",
      });
    }

    if (!value || typeof value !== "string" || !value.trim()) {
      return res.status(400).json({
        success: false,
        message: "Value is required and must be a non-empty string",
      });
    }

    const trimmedKey = key.trim();
    const trimmedValue = value.trim();

    // Validate key format (alphanumeric, underscore, dash only)
    if (!/^[a-zA-Z0-9_-]+$/.test(trimmedKey)) {
      return res.status(400).json({
        success: false,
        message:
          "Key can only contain letters, numbers, underscores, and dashes",
      });
    }

    const globalContext = await prisma.globalContext.upsert({
      where: {
        userId_key: {
          userId,
          key: trimmedKey,
        },
      },
      update: {
        value: trimmedValue,
        category: category?.trim() || null,
        isActive: true,
      },
      create: {
        userId,
        key: trimmedKey,
        value: trimmedValue,
        category: category?.trim() || null,
      },
    });

    console.log(`✅ Global context saved for user ${userId}: ${trimmedKey}`);

    return res.status(200).json({
      success: true,
      message: "Global context item saved successfully",
      globalContext,
    });
  } catch (error) {
    console.error("Error setting global context:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while saving global context",
    });
  }
};

// Delete a global context item (soft delete by setting isActive to false)
export const deleteGlobalContext = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const { key } = req.params;
    const keyStr = String(key);

    if (!keyStr) {
      return res.status(400).json({
        success: false,
        message: "Key is required",
      });
    }

    const globalContext = await prisma.globalContext.updateMany({
      where: {
        userId,
        key: keyStr,
        isActive: true,
      },
      data: {
        isActive: false,
      },
    });

    if (globalContext.count === 0) {
      return res.status(404).json({
        success: false,
        message: "Global context item not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Global context item deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting global context:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while deleting global context",
    });
  }
};

// Get global context formatted for AI consumption
export const getGlobalContextForAI = async (userId: string) => {
  try {
    const globalContexts = await prisma.globalContext.findMany({
      where: {
        userId,
        isActive: true,
      },
      orderBy: {
        category: "asc",
      },
    });

    // Group by category and format for AI
    const contextByCategory: { [key: string]: string[] } = {};
    globalContexts.forEach((item) => {
      const category = item.category || "general";
      if (!contextByCategory[category]) {
        contextByCategory[category] = [];
      }
      contextByCategory[category].push(`${item.key}: ${item.value}`);
    });

    // Format as readable text
    let formattedContext = "";
    Object.keys(contextByCategory).forEach((category) => {
      formattedContext += `${category.toUpperCase()}:\n`;
      contextByCategory[category].forEach((item) => {
        formattedContext += `- ${item}\n`;
      });
      formattedContext += "\n";
    });

    return formattedContext.trim();
  } catch (error) {
    console.error("Error getting global context for AI:", error);
    return "";
  }
};
