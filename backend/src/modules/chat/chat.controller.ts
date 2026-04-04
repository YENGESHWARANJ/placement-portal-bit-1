import { Request, Response } from "express";
import { Chat, Message } from "./chat.model";
import User from "../users/user.model";
import mongoose from "mongoose";

// Get all chats for the current user
export const getMyChats = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId;
        if (!userId) return res.status(401).json({ message: "Unauthorized" });

        const chats = await Chat.find({
            participants: new mongoose.Types.ObjectId(userId),
            isActive: true,
        })
            .sort({ lastMessageAt: -1 })
            .lean();

        // Add unread count for this user
        const result = chats.map((chat) => ({
            ...chat,
            myUnread: chat.unreadCount?.get?.(userId) || (chat.unreadCount as any)?.[userId] || 0,
        }));

        return res.json({ success: true, data: result });
    } catch (error) {
        console.error("[CHAT] getMyChats error:", error);
        return res.status(500).json({ message: "Failed to fetch chats." });
    }
};

// Search users to chat with
export const searchUsers = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId;
        const query = (req.query.q as string) || "";
        if (!userId) return res.status(401).json({ message: "Unauthorized" });

        const currentUser = await User.findById(userId).select("role");
        if (!currentUser) return res.status(404).json({ message: "User not found" });

        console.log(`[CHAT] Debug Search: Fetching ALL users (excluding ${userId})`);
        const users = await User.find({
            _id: { $ne: userId }
        })
            .select("name email role status")
            .limit(50)
            .lean();

        console.log(`[CHAT] Debug Found ${users.length} users:`, JSON.stringify(users.map(u => u.email)));
        return res.json({ success: true, data: users });
    } catch (error) {
        console.error("[CHAT] searchUsers error:", error);
        return res.status(500).json({ message: "Failed to search users." });
    }
};

// Start a new chat or return existing
export const startChat = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId;
        const { targetUserId, jobId, jobTitle } = req.body;
        if (!userId || !targetUserId) return res.status(400).json({ message: "Missing user info" });

        // Check if chat already exists between these two
        const existing = await Chat.findOne({
            participants: { $all: [new mongoose.Types.ObjectId(userId), new mongoose.Types.ObjectId(targetUserId)] },
            isActive: true,
        });

        if (existing) return res.json({ success: true, data: existing });

        // Get user info
        const [me, target] = await Promise.all([
            User.findById(userId).select("name role"),
            User.findById(targetUserId).select("name role"),
        ]);

        if (!me || !target) return res.status(404).json({ message: "User not found" });

        const chat = await Chat.create({
            participants: [me._id, target._id],
            participantRoles: [
                { userId: me._id, role: me.role, name: me.name },
                { userId: target._id, role: target.role, name: target.name },
            ],
            lastMessage: "Chat started",
            lastMessageAt: new Date(),
            jobRef: jobId || undefined,
            jobTitle: jobTitle || undefined,
            unreadCount: new Map(),
        });

        return res.status(201).json({ success: true, data: chat });
    } catch (error) {
        console.error("[CHAT] startChat error:", error);
        return res.status(500).json({ message: "Failed to start chat." });
    }
};

// Get messages for a chat
export const getChatMessages = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId;
        const { chatId } = req.params;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 50;

        if (!userId) return res.status(401).json({ message: "Unauthorized" });

        // Verify user is participant
        const chat = await Chat.findOne({
            _id: chatId,
            participants: new mongoose.Types.ObjectId(userId),
        });

        if (!chat) return res.status(404).json({ message: "Chat not found" });

        const messages = await Message.find({ chatId })
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .lean();

        const total = await Message.countDocuments({ chatId });

        return res.json({
            success: true,
            data: messages.reverse(),
            pagination: { page, limit, total, pages: Math.ceil(total / limit) },
        });
    } catch (error) {
        console.error("[CHAT] getChatMessages error:", error);
        return res.status(500).json({ message: "Failed to fetch messages." });
    }
};

// Send a message
export const sendMessage = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId;
        const { chatId } = req.params;
        const { content, type = "text" } = req.body;

        if (!userId) return res.status(401).json({ message: "Unauthorized" });
        if (!content?.trim()) return res.status(400).json({ message: "Message cannot be empty" });

        // Verify user is participant
        const chat = await Chat.findOne({
            _id: chatId,
            participants: new mongoose.Types.ObjectId(userId),
        });

        if (!chat) return res.status(404).json({ message: "Chat not found" });

        const sender = await User.findById(userId).select("role");
        if (!sender) return res.status(404).json({ message: "User not found" });

        const message = await Message.create({
            chatId,
            sender: userId,
            senderRole: sender.role,
            content: content.trim(),
            type,
            readBy: [userId],
        });

        // Update chat metadata
        const unreadUpdate: any = {};
        chat.participants.forEach((pid) => {
            if (pid.toString() !== userId) {
                unreadUpdate[`unreadCount.${pid.toString()}`] = ((chat.unreadCount as any)?.[pid.toString()] || 0) + 1;
            }
        });

        await Chat.findByIdAndUpdate(chatId, {
            lastMessage: content.trim().substring(0, 100),
            lastMessageAt: new Date(),
            ...unreadUpdate,
        });

        // Emit via Socket.io if available
        const io = (req.app as any).io;
        if (io) {
            chat.participants.forEach((pid) => {
                if (pid.toString() !== userId) {
                    io.to(pid.toString()).emit("new_message", {
                        chatId,
                        message,
                    });
                }
            });
        }

        return res.status(201).json({ success: true, data: message });
    } catch (error) {
        console.error("[CHAT] sendMessage error:", error);
        return res.status(500).json({ message: "Failed to send message." });
    }
};

// Mark all messages as read
export const markAsRead = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId;
        const { chatId } = req.params;

        if (!userId) return res.status(401).json({ message: "Unauthorized" });

        // Reset unread count
        await Chat.findByIdAndUpdate(chatId, {
            [`unreadCount.${userId}`]: 0,
        });

        // Mark messages as read
        await Message.updateMany(
            { chatId, sender: { $ne: userId }, readBy: { $ne: userId } },
            { $addToSet: { readBy: userId } }
        );

        return res.json({ success: true });
    } catch (error) {
        console.error("[CHAT] markAsRead error:", error);
        return res.status(500).json({ message: "Failed to mark as read." });
    }
};

// Delete a message
export const deleteMessage = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId;
        const { messageId } = req.params;

        if (!userId) return res.status(401).json({ message: "Unauthorized" });

        const message = await Message.findById(messageId);
        if (!message) return res.status(404).json({ message: "Message not found" });

        const currentUser = await User.findById(userId).select("role");
        const isAdmin = currentUser?.role === "admin";

        if (message.sender.toString() !== userId && !isAdmin) {
            return res.status(403).json({ message: "You can only delete your own messages" });
        }

        await Message.findByIdAndDelete(messageId);

        return res.json({ success: true, message: "Message deleted successfully" });
    } catch (error) {
        console.error("[CHAT] deleteMessage error:", error);
        return res.status(500).json({ message: "Failed to delete message." });
    }
};

// Delete a complete chat conversation
export const deleteChat = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId;
        const { chatId } = req.params;

        if (!userId) return res.status(401).json({ message: "Unauthorized" });

        const chat = await Chat.findById(chatId);
        if (!chat) return res.status(404).json({ message: "Chat not found" });

        const currentUser = await User.findById(userId).select("role");
        const isAdmin = currentUser?.role === "admin";

        // Check if user is participant or admin
        const isParticipant = chat.participants.some(p => p.toString() === userId);
        if (!isParticipant && !isAdmin) {
            return res.status(403).json({ message: "You can only delete your own chats" });
        }

        // Delete all messages in the chat
        await Message.deleteMany({ chatId });
        
        // Delete the chat itself
        await Chat.findByIdAndDelete(chatId);

        return res.json({ success: true, message: "Chat deleted successfully" });
    } catch (error) {
        console.error("[CHAT] deleteChat error:", error);
        return res.status(500).json({ message: "Failed to delete chat." });
    }
};
