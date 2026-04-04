import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import {
    getMyChats,
    getChatMessages,
    sendMessage,
    startChat,
    markAsRead,
    searchUsers,
    deleteMessage,
    deleteChat,
} from "./chat.controller";

const router = Router();

router.use(authMiddleware);

// Get all chats for the current user
router.get("/", getMyChats);

// Search users to start a new chat
router.get("/search-users", searchUsers);

// Start a new chat or get existing one
router.post("/start", startChat);

// Get messages for a specific chat
router.get("/:chatId/messages", getChatMessages);

// Send a message in a chat
router.post("/:chatId/messages", sendMessage);

// Mark messages as read
router.put("/:chatId/read", markAsRead);

// Delete a message
router.delete("/messages/:messageId", deleteMessage);

// Delete an entire chat
router.delete("/:chatId", deleteChat);

export default router;
