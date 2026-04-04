import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    MessageCircle, Send, Search, ArrowLeft, Users, Clock,
    CheckCheck, Circle, Plus, Sparkles, UserPlus, X, Trash2,
    GraduationCap, Briefcase, Shield, Crown
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useAuth } from "../../features/auth/AuthContext";
import api from "../../services/api";
import { cn } from "../../utils/cn";

interface ChatUser {
    _id: string;
    name: string;
    email: string;
    role: string;
}

interface ChatItem {
    _id: string;
    participantRoles: { userId: string; role: string; name: string }[];
    lastMessage?: string;
    lastMessageAt?: string;
    jobTitle?: string;
    myUnread: number;
}

interface MessageItem {
    _id: string;
    sender: string;
    senderRole: string;
    content: string;
    type: string;
    createdAt: string;
    readBy: string[];
}

// Role color/icon config for multi-role support
const ROLE_CONFIG: Record<string, { gradient: string; bg: string; text: string; label: string; icon: any }> = {
    student: {
        gradient: "bg-gradient-to-br from-blue-500 to-indigo-600",
        bg: "bg-blue-50",
        text: "text-blue-600",
        label: "Student",
        icon: GraduationCap,
    },
    recruiter: {
        gradient: "bg-gradient-to-br from-emerald-500 to-teal-600",
        bg: "bg-emerald-50",
        text: "text-emerald-600",
        label: "Mentor",
        icon: Briefcase,
    },
    officer: {
        gradient: "bg-gradient-to-br from-amber-500 to-orange-600",
        bg: "bg-amber-50",
        text: "text-amber-600",
        label: "Officer",
        icon: Shield,
    },
    admin: {
        gradient: "bg-gradient-to-br from-purple-500 to-violet-600",
        bg: "bg-purple-50",
        text: "text-purple-600",
        label: "Admin",
        icon: Crown,
    },
};

const getRoleConfig = (role: string) => ROLE_CONFIG[role] || ROLE_CONFIG.student;

export default function ChatPage() {
    const { user } = useAuth();
    const [chats, setChats] = useState<ChatItem[]>([]);
    const [activeChat, setActiveChat] = useState<ChatItem | null>(null);
    const [messages, setMessages] = useState<MessageItem[]>([]);
    const [newMsg, setNewMsg] = useState("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [showNewChat, setShowNewChat] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<ChatUser[]>([]);
    const [searching, setSearching] = useState(false);
    const [mobileShowChat, setMobileShowChat] = useState(false);
    const [filterRole, setFilterRole] = useState<string>("all");
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const pollRef = useRef<any>(null);

    // Fetch all chats
    const fetchChats = useCallback(async () => {
        try {
            const { data } = await api.get<{ success: boolean; data: ChatItem[] }>("/chat");
            if (data.success) setChats(data.data);
        } catch (err) {
            console.error("Failed to fetch chats");
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch messages for active chat
    const fetchMessages = useCallback(async (chatId: string) => {
        try {
            const { data } = await api.get<{ success: boolean; data: MessageItem[] }>(`/chat/${chatId}/messages`);
            if (data.success) setMessages(data.data);
        } catch (err) {
            console.error("Failed to fetch messages");
        }
    }, []);

    // Search users
    const searchUsers = useCallback(async (q: string) => {
        setSearching(true);
        try {
            const { data } = await api.get<{ success: boolean; data: ChatUser[] }>(`/chat/search-users?q=${encodeURIComponent(q)}`);
            if (data.success) setSearchResults(data.data);
        } catch (err) {
            console.error("Search failed");
        } finally {
            setSearching(false);
        }
    }, []);

    useEffect(() => { fetchChats(); }, [fetchChats]);

    // Fetch default users when modal is opened
    useEffect(() => {
        if (showNewChat) {
            searchUsers("");
        }
    }, [showNewChat, searchUsers]);

    // Poll for new messages every 3 seconds
    useEffect(() => {
        if (activeChat) {
            pollRef.current = setInterval(() => {
                fetchMessages(activeChat._id);
                fetchChats();
            }, 3000);
        }
        return () => { if (pollRef.current) clearInterval(pollRef.current); };
    }, [activeChat, fetchMessages, fetchChats]);

    // Scroll to bottom on new messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Open a chat
    const openChat = async (chat: ChatItem) => {
        setActiveChat(chat);
        setMobileShowChat(true);
        await fetchMessages(chat._id);
        // Mark as read
        try { await api.put(`/chat/${chat._id}/read`); } catch { }
        fetchChats();
        setTimeout(() => inputRef.current?.focus(), 200);
    };

    // Start new chat
    const startNewChat = async (targetUser: ChatUser) => {
        try {
            const { data } = await api.post<{ success: boolean; data: ChatItem }>("/chat/start", { targetUserId: targetUser._id });
            if (data.success) {
                toast.success(`Chat started with ${targetUser.name}!`);
                setShowNewChat(false);
                setSearchQuery("");
                setSearchResults([]);
                await fetchChats();
                openChat(data.data);
            }
        } catch (err) {
            toast.error("Failed to start chat");
        }
    };

    // Send message
    const sendMessage = async () => {
        if (!newMsg.trim() || !activeChat || sending) return;
        setSending(true);
        try {
            const { data } = await api.post<{ success: boolean; data: MessageItem }>(`/chat/${activeChat._id}/messages`, { content: newMsg });
            if (data.success) {
                setMessages((prev) => [...prev, data.data]);
                setNewMsg("");
                fetchChats();
            }
        } catch (err) {
            toast.error("Failed to send message");
        } finally {
            setSending(false);
        }
    };

    // Delete message
    const handleDeleteMessage = async (msgId: string) => {
        try {
            const { data } = await api.delete<{ success: boolean }>(`/chat/messages/${msgId}`);
            if (data.success) {
                setMessages((prev) => prev.filter((m) => m._id !== msgId));
                toast.success("Message deleted");
                fetchChats(); // Update latest message in sidebar
            }
        } catch (err) {
            toast.error("Failed to delete message");
        }
    };

    // Delete entire chat
    const handleDeleteChat = async (chatId: string, e: React.MouseEvent) => {
        e.stopPropagation(); // prevent opening the chat
        try {
            const { data } = await api.delete<{ success: boolean }>(`/chat/${chatId}`);
            if (data.success) {
                setChats((prev) => prev.filter((c) => c._id !== chatId));
                if (activeChat?._id === chatId) {
                    setActiveChat(null);
                    setMessages([]);
                }
                toast.success("Conversation deleted");
            }
        } catch (err) {
            toast.error("Failed to delete conversation");
        }
    };

    const getOtherParticipant = (chat: ChatItem) => {
        return chat.participantRoles?.find((p) => p.userId !== user?._id) || { name: "Unknown", role: "student" };
    };

    const formatTime = (d: string) => {
        const date = new Date(d);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        if (diff < 60000) return "Just now";
        if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
        if (diff < 86400000) return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        return date.toLocaleDateString([], { month: "short", day: "numeric" });
    };

    // Filtered chats based on role filter
    const filteredChats = filterRole === "all"
        ? chats
        : chats.filter((chat) => {
            const other = getOtherParticipant(chat);
            return other.role === filterRole;
        });

    // Get unique roles for filter tabs
    const availableRoles = ["all", ...new Set(chats.map((c) => getOtherParticipant(c).role))];

    const getRoleLabel = (role: string) => {
        if (role === "all") return "All";
        return getRoleConfig(role).label;
    };

    return (
        <div className="h-[calc(100vh-6rem)] flex rounded-3xl overflow-hidden border border-slate-200 bg-white shadow-xl">
            {/* Sidebar - Chat List */}
            <div className={cn(
                "w-full md:w-96 border-r border-slate-200 flex flex-col bg-white",
                mobileShowChat ? "hidden md:flex" : "flex"
            )}>
                {/* Header */}
                <div className="p-6 border-b border-slate-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-lg shadow-rose-500/20">
                                <MessageCircle className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-slate-900 tracking-tight">Messages</h2>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                    {chats.length} conversations
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowNewChat(true)}
                            className="h-10 w-10 rounded-2xl bg-rose-500 text-white flex items-center justify-center hover:bg-rose-600 transition-all active:scale-95 shadow-lg shadow-rose-500/20"
                        >
                            <Plus className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Search */}
                    <div className="relative mb-3">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search conversations..."
                            className="w-full h-10 bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 text-sm focus:ring-2 focus:ring-rose-500/20 focus:border-rose-300 transition-all outline-none"
                            onChange={(e) => {
                                // Local filter handled by search
                            }}
                        />
                    </div>

                    {/* Role Filter Tabs */}
                    <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
                        {availableRoles.map((role) => (
                            <button
                                key={role}
                                onClick={() => setFilterRole(role)}
                                className={cn(
                                    "px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all",
                                    filterRole === role
                                        ? "bg-rose-500 text-white shadow-md shadow-rose-500/20"
                                        : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                                )}
                            >
                                {getRoleLabel(role)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Chat List */}
                <div className="flex-1 overflow-y-auto">
                    {loading ? (
                        <div className="flex items-center justify-center h-40">
                            <div className="h-8 w-8 rounded-full border-2 border-slate-200 border-t-rose-500 animate-spin" />
                        </div>
                    ) : filteredChats.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                            <div className="h-16 w-16 rounded-3xl bg-slate-50 flex items-center justify-center mb-4">
                                <Users className="h-8 w-8 text-slate-300" />
                            </div>
                            <h3 className="text-sm font-bold text-slate-500 mb-1">No conversations yet</h3>
                            <p className="text-xs text-slate-400">Start a new chat to connect!</p>
                            <button
                                onClick={() => setShowNewChat(true)}
                                className="mt-4 px-4 py-2 bg-rose-500 text-white rounded-xl text-xs font-bold hover:bg-rose-600 transition-all shadow-md shadow-rose-500/20"
                            >
                                <UserPlus className="h-3.5 w-3.5 inline mr-1.5" />
                                New Chat
                            </button>
                        </div>
                    ) : (
                        filteredChats.map((chat) => {
                            const other = getOtherParticipant(chat);
                            const isActive = activeChat?._id === chat._id;
                            const roleConf = getRoleConfig(other.role);
                            return (
                                <div key={chat._id} className="relative group/chat">
                                    <button
                                        onClick={() => openChat(chat)}
                                        className={cn(
                                            "w-full flex items-center gap-3.5 p-4 border-b border-slate-50 hover:bg-slate-50/80 transition-all text-left",
                                            isActive && "bg-rose-50/60 border-l-2 border-l-rose-500"
                                        )}
                                    >
                                        <div className="relative shrink-0">
                                            <div className={cn(
                                                "h-12 w-12 rounded-2xl flex items-center justify-center text-white text-sm font-bold",
                                                roleConf.gradient
                                            )}>
                                                {other.name?.charAt(0)?.toUpperCase() || "?"}
                                            </div>
                                            {chat.myUnread > 0 && (
                                                <span className="absolute -top-1 -right-1 h-5 w-5 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center shadow-lg">
                                                    {chat.myUnread}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0 pr-6">
                                            <div className="flex items-center justify-between mb-0.5">
                                                <span className="text-sm font-bold text-slate-900 truncate">{other.name}</span>
                                                {chat.lastMessageAt && (
                                                    <span className="text-[10px] text-slate-400 shrink-0 ml-2">{formatTime(chat.lastMessageAt)}</span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <span className={cn(
                                                    "text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md",
                                                    roleConf.bg, roleConf.text
                                                )}>
                                                    {roleConf.label}
                                                </span>
                                                {chat.lastMessage && (
                                                    <span className="text-xs text-slate-400 truncate">{chat.lastMessage}</span>
                                                )}
                                            </div>
                                        </div>
                                    </button>

                                    {/* Delete Chat Button overlay */}
                                    <button
                                        onClick={(e) => handleDeleteChat(chat._id, e)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover/chat:opacity-100 p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-100 rounded-lg transition-all"
                                        title="Delete conversation"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Main Chat Area */}
            <div className={cn(
                "flex-1 flex flex-col bg-slate-50/30",
                !mobileShowChat ? "hidden md:flex" : "flex"
            )}>
                {activeChat ? (
                    <>
                        {/* Chat Header */}
                        {(() => {
                            const otherP = getOtherParticipant(activeChat);
                            const roleConf = getRoleConfig(otherP.role);
                            const RoleIcon = roleConf.icon;
                            return (
                                <div className="h-16 px-6 border-b border-slate-200 bg-white flex items-center gap-4">
                                    <button
                                        onClick={() => { setMobileShowChat(false); setActiveChat(null); }}
                                        className="md:hidden p-1.5 rounded-lg hover:bg-slate-50 text-slate-500"
                                    >
                                        <ArrowLeft className="h-5 w-5" />
                                    </button>
                                    <div className={cn(
                                        "h-10 w-10 rounded-xl flex items-center justify-center text-white text-sm font-bold shrink-0",
                                        roleConf.gradient
                                    )}>
                                        {otherP.name?.charAt(0)?.toUpperCase()}
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-slate-900">{otherP.name}</h3>
                                        <div className="flex items-center gap-1.5">
                                            <RoleIcon className={cn("h-3 w-3", roleConf.text)} />
                                            <p className={cn("text-[10px] font-bold uppercase tracking-widest", roleConf.text)}>
                                                {roleConf.label}
                                                {activeChat.jobTitle && ` • ${activeChat.jobTitle}`}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="ml-auto flex items-center gap-2">
                                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 rounded-lg">
                                            <Circle className="h-2 w-2 fill-emerald-500 text-emerald-500" />
                                            <span className="text-[10px] font-bold text-emerald-600 uppercase">Active</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })()}

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                            {messages.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center">
                                    <Sparkles className="h-10 w-10 text-slate-300 mb-3" />
                                    <p className="text-sm font-bold text-slate-500">Start the conversation!</p>
                                    <p className="text-xs text-slate-400 mt-1">Send your first message below.</p>
                                </div>
                            ) : (
                                messages.map((msg) => {
                                    const isMe = msg.sender === user?._id;
                                    return (
                                        <motion.div
                                            key={msg._id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className={cn("flex group items-center", isMe ? "justify-end" : "justify-start")}
                                        >
                                            {isMe && (
                                                <div className="opacity-0 group-hover:opacity-100 transition-opacity mr-2 flex items-center shrink-0">
                                                    <button 
                                                        onClick={() => handleDeleteMessage(msg._id)}
                                                        className="p-1.5 text-slate-400 hover:text-rose-500 bg-white/50 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-100"
                                                        title="Delete message"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            )}
                                            
                                            <div className={cn(
                                                "max-w-[70%] px-4 py-3 rounded-2xl shadow-sm",
                                                isMe
                                                    ? "bg-rose-500 text-white rounded-br-md"
                                                    : "bg-white text-slate-900 rounded-bl-md border border-slate-200"
                                            )}>
                                                {!isMe && (
                                                    <div className="flex items-center gap-1.5 mb-1">
                                                        {(() => {
                                                            const senderConf = getRoleConfig(msg.senderRole);
                                                            return (
                                                                <span className={cn("text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded", senderConf.bg, senderConf.text)}>
                                                                    {senderConf.label}
                                                                </span>
                                                            );
                                                        })()}
                                                    </div>
                                                )}
                                                <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{msg.content}</p>
                                                <div className={cn(
                                                    "flex items-center gap-1.5 mt-1.5",
                                                    isMe ? "justify-end" : "justify-start"
                                                )}>
                                                    <span className={cn(
                                                        "text-[10px] font-medium",
                                                        isMe ? "text-white/70" : "text-slate-400"
                                                    )}>
                                                        {formatTime(msg.createdAt)}
                                                    </span>
                                                    {isMe && (
                                                        <CheckCheck className={cn(
                                                            "h-3 w-3",
                                                            msg.readBy?.length > 1 ? "text-white" : "text-white/40"
                                                        )} />
                                                    )}
                                                </div>
                                            </div>

                                            {!isMe && user?.role === "admin" && (
                                                <div className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 flex items-center shrink-0">
                                                    <button 
                                                        onClick={() => handleDeleteMessage(msg._id)}
                                                        className="p-1.5 text-slate-400 hover:text-rose-500 bg-white/50 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-100"
                                                        title="Delete user message"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            )}
                                        </motion.div>
                                    );
                                })
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Message Input */}
                        <div className="p-4 border-t border-slate-200 bg-white">
                            <div className="flex items-center gap-3">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={newMsg}
                                    onChange={(e) => setNewMsg(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
                                    placeholder="Type a message..."
                                    className="flex-1 h-12 bg-slate-50 border border-slate-200 rounded-2xl px-5 text-sm focus:ring-2 focus:ring-rose-500/20 focus:border-rose-300 transition-all outline-none"
                                    disabled={sending}
                                />
                                <button
                                    onClick={sendMessage}
                                    disabled={!newMsg.trim() || sending}
                                    className={cn(
                                        "h-12 w-12 rounded-2xl flex items-center justify-center transition-all active:scale-95",
                                        newMsg.trim()
                                            ? "bg-rose-500 text-white shadow-lg shadow-rose-500/20 hover:bg-rose-600"
                                            : "bg-slate-100 text-slate-400"
                                    )}
                                >
                                    {sending ? (
                                        <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                                    ) : (
                                        <Send className="h-4.5 w-4.5" />
                                    )}
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="hidden md:flex flex-col items-center justify-center h-full text-center p-8">
                        <div className="h-20 w-20 rounded-3xl bg-rose-50 flex items-center justify-center mb-5">
                            <MessageCircle className="h-10 w-10 text-rose-300" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-500 mb-2">Select a conversation</h3>
                        <p className="text-xs text-slate-400 max-w-xs">
                            Pick a chat from the sidebar or start a new conversation to connect with students, mentors, officers, or admins.
                        </p>
                    </div>
                )}
            </div>

            {/* New Chat Modal */}
            <AnimatePresence>
                {showNewChat && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
                            onClick={() => setShowNewChat(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="fixed inset-x-4 top-[15%] md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-[440px] bg-white rounded-3xl shadow-2xl z-50 overflow-hidden"
                        >
                            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900">New Conversation</h3>
                                    <p className="text-xs text-slate-400 mt-0.5">
                                        Search for anyone to start a conversation
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => searchUsers(searchQuery)}
                                        className="p-2 rounded-xl hover:bg-slate-50 text-rose-500"
                                        title="Refresh Suggestions"
                                    >
                                        <Sparkles className="h-5 w-5" />
                                    </button>
                                    <button onClick={() => setShowNewChat(false)} className="p-2 rounded-xl hover:bg-slate-50 text-slate-500">
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>

                            <div className="p-4">
                                <div className="relative">
                                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => { setSearchQuery(e.target.value); searchUsers(e.target.value); }}
                                        placeholder="Search students, mentors, officers, admins..."
                                        className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 text-sm focus:ring-2 focus:ring-rose-500/20 focus:border-rose-300 transition-all outline-none"
                                        autoFocus
                                    />
                                </div>
                            </div>

                            <div className="max-h-72 overflow-y-auto px-4 pb-4">
                                {searching ? (
                                    <div className="flex items-center justify-center py-8">
                                        <div className="h-6 w-6 rounded-full border-2 border-slate-200 border-t-rose-500 animate-spin" />
                                    </div>
                                ) : searchResults.length === 0 ? (
                                    <div className="text-center py-12">
                                        <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Users className="h-8 w-8 text-slate-200" />
                                        </div>
                                        <p className="text-sm font-medium text-slate-900">
                                            {searchQuery ? "No users found" : "Looking for suggestions..."}
                                        </p>
                                        <p className="text-xs text-slate-400 mt-1">
                                            {searchQuery ? "Try a different name" : "We're loading people you can chat with"}
                                        </p>
                                    </div>
                                ) : (
                                    <>
                                        {!searchQuery && (
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">
                                                People You May Know
                                            </p>
                                        )}
                                        {searchResults.map((u) => {
                                        const roleConf = getRoleConfig(u.role);
                                        const RoleIcon = roleConf.icon;
                                        return (
                                            <button
                                                key={u._id}
                                                onClick={() => startNewChat(u)}
                                                className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 transition-all text-left mb-1"
                                            >
                                                <div className={cn(
                                                    "h-10 w-10 rounded-xl flex items-center justify-center text-white text-sm font-bold",
                                                    roleConf.gradient
                                                )}>
                                                    {u.name?.charAt(0)?.toUpperCase()}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-bold text-slate-900 truncate">{u.name}</p>
                                                    <p className="text-xs text-slate-400 truncate">{u.email}</p>
                                                </div>
                                                <div className={cn("flex items-center gap-1 px-2 py-1 rounded-lg", roleConf.bg)}>
                                                    <RoleIcon className={cn("h-3 w-3", roleConf.text)} />
                                                    <span className={cn("text-[10px] font-bold uppercase tracking-wider", roleConf.text)}>
                                                        {roleConf.label}
                                                    </span>
                                                </div>
                                            </button>
                                        );
                                    })}
                                    </>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
