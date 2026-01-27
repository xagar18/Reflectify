import prisma from "../config/db.js";

// Create a new conversation
export const createConversation = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title } = req.body;

    const conversation = await prisma.conversation.create({
      data: {
        userId,
        title: title || "New Reflection",
      },
      include: {
        messages: true,
      },
    });

    res.status(201).json({
      success: true,
      conversation,
    });
  } catch (error) {
    console.error("Error creating conversation:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create conversation",
    });
  }
};

// Get all conversations for a user (titles only, no messages for faster loading)
export const getConversations = async (req, res) => {
  try {
    const userId = req.user.id;

    const conversations = await prisma.conversation.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
    });

    // Add empty messages array for compatibility
    const conversationsWithEmptyMessages = conversations.map((conv) => ({
      ...conv,
      messages: [],
    }));

    res.status(200).json({
      success: true,
      conversations: conversationsWithEmptyMessages,
    });
  } catch (error) {
    console.error("Error fetching conversations:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch conversations",
    });
  }
};

// Get a single conversation by ID
export const getConversation = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const conversation = await prisma.conversation.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    res.status(200).json({
      success: true,
      conversation,
    });
  } catch (error) {
    console.error("Error fetching conversation:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch conversation",
    });
  }
};

// Add a message to a conversation
export const addMessage = async (req, res) => {
  try {
    const userId = req.user.id;
    const { conversationId } = req.params;
    const { content, role } = req.body;

    // Verify the conversation belongs to the user
    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
        userId,
      },
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    // Create the message
    const message = await prisma.message.create({
      data: {
        conversationId,
        content,
        role,
      },
    });

    // Update conversation's updatedAt timestamp
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    });

    res.status(201).json({
      success: true,
      message,
    });
  } catch (error) {
    console.error("Error adding message:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add message",
    });
  }
};

// Add multiple messages at once (for saving user + assistant pair)
export const addMessages = async (req, res) => {
  try {
    const userId = req.user.id;
    const { conversationId } = req.params;
    const { messages } = req.body;

    // Verify the conversation belongs to the user
    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
        userId,
      },
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    // Create all messages
    const createdMessages = await prisma.message.createMany({
      data: messages.map((msg) => ({
        conversationId,
        content: msg.content,
        role: msg.role,
      })),
    });

    // Update conversation's updatedAt timestamp and title if first messages
    const existingMessages = await prisma.message.count({
      where: { conversationId },
    });

    const updateData = { updatedAt: new Date() };

    // Update title from first user message if it's still "New Reflection"
    if (conversation.title === "New Reflection" && messages.length > 0) {
      const firstUserMessage = messages.find((m) => m.role === "user");
      if (firstUserMessage) {
        const newTitle = firstUserMessage.content
          .replace(/[^\w\s]/gi, "")
          .trim()
          .split(" ")
          .slice(0, 5)
          .join(" ");
        updateData.title = newTitle || "New Reflection";
      }
    }

    await prisma.conversation.update({
      where: { id: conversationId },
      data: updateData,
    });

    res.status(201).json({
      success: true,
      count: createdMessages.count,
    });
  } catch (error) {
    console.error("Error adding messages:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add messages",
    });
  }
};

// Update conversation title
export const updateConversation = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { title } = req.body;

    const conversation = await prisma.conversation.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    const updated = await prisma.conversation.update({
      where: { id },
      data: { title },
    });

    res.status(200).json({
      success: true,
      conversation: updated,
    });
  } catch (error) {
    console.error("Error updating conversation:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update conversation",
    });
  }
};

// Delete a conversation
export const deleteConversation = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const conversation = await prisma.conversation.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    // Messages will be cascade deleted
    await prisma.conversation.delete({
      where: { id },
    });

    res.status(200).json({
      success: true,
      message: "Conversation deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting conversation:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete conversation",
    });
  }
};

// Delete all conversations for a user
export const deleteAllConversations = async (req, res) => {
  try {
    const userId = req.user.id;

    await prisma.conversation.deleteMany({
      where: { userId },
    });

    res.status(200).json({
      success: true,
      message: "All conversations deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting all conversations:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete conversations",
    });
  }
};
