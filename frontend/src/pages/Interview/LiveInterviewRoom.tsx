import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Video, Mic, MicOff, VideoOff, PhoneOff, MonitorUp,
    MessageSquare, Users, Code2, Zap, AlertCircle, Maximize2, Minimize2, Play
} from 'lucide-react';
import { useAuth } from '../../features/auth/AuthContext';
import { getSocket } from '../../hooks/useSocket';
import { cn } from '../../utils/cn';
import toast from 'react-hot-toast';

export default function LiveInterviewRoom() {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [code, setCode] = useState('// Welcome to the Nexus Live Interview Room\n// Start typing to synchronize code with your peer.\n\nfunction solve(input) {\n  \n}\n');
    const [language, setLanguage] = useState('javascript');
    const [isMicOn, setIsMicOn] = useState(true);
    const [isVideoOn, setIsVideoOn] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [peers, setPeers] = useState<string[]>([]);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const socket = user?._id ? getSocket(user._id) : null;

    useEffect(() => {
        if (!socket || !roomId || !user) return;

        // Join room
        socket.emit('join_interview_room', { roomId, userName: user.name });
        toast.success('Joined Live Session', { icon: '🟢' });

        // Listeners
        socket.on('room_users', (users: string[]) => {
            setPeers(users.filter(u => u !== user.name));
        });

        socket.on('user_joined_room', (name: string) => {
            if (name !== user.name) {
                toast(`${name} joined the session`, { icon: '👋' });
            }
        });

        socket.on('user_left_room', (name: string) => {
            toast(`${name} left the session`, { icon: '👋' });
        });

        socket.on('code_update', (newCode: string) => {
            setCode(newCode);
        });

        return () => {
            socket.emit('leave_interview_room', { roomId, userName: user.name });
            socket.off('room_users');
            socket.off('user_joined_room');
            socket.off('user_left_room');
            socket.off('code_update');
        };
    }, [socket, roomId, user]);

    const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newCode = e.target.value;
        setCode(newCode);
        if (socket && roomId) {
            socket.emit('code_change', { roomId, code: newCode });
        }
    };

    const handleLeave = () => {
        navigate(-1);
    };

    const handleRunCode = () => {
        toast.success("Code execution simulated successfully.", { icon: "🚀" })
    }

    return (
        <div className={cn(
            "fixed inset-0 bg-[#080B1A] z-[100] flex flex-col font-sans",
            isFullscreen ? "p-0" : "p-4 lg:p-6"
        )}>
            {/* Dynamic Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full mix-blend-screen" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full mix-blend-screen" />
            </div>

            <div className="relative z-10 flex flex-col h-full bg-[#0F1225]/80 backdrop-blur-2xl rounded-[30px] border border-white/5 shadow-2xl overflow-hidden">

                {/* Header */}
                <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 shrink-0 bg-white/[0.02]">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-white font-black italic tracking-widest text-sm">NEXUS_LIVE</span>
                        </div>
                        <div className="h-4 w-px bg-white/10" />
                        <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Room ID: {roomId}</span>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex items-center -space-x-2 mr-4">
                            <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-[10px] font-black text-white border-2 border-[#0F1225] z-10" title={user?.name}>
                                {user?.name?.charAt(0) || 'U'}
                            </div>
                            {peers.map((p, i) => (
                                <div key={i} className="h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center text-[10px] font-black text-white border-2 border-[#0F1225]" title={p}>
                                    {p.charAt(0)}
                                </div>
                            ))}
                            <div className="h-8 pl-4 pr-3 rounded-full bg-white/5 flex items-center justify-center text-[10px] font-bold text-slate-400 border border-white/10">
                                {peers.length + 1} Connected
                            </div>
                        </div>

                        <button onClick={() => setIsFullscreen(!isFullscreen)} className="h-10 w-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-300 transition-colors">
                            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                        </button>
                        <button onClick={handleLeave} className="px-6 py-2.5 bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white rounded-xl text-[11px] font-black uppercase tracking-widest transition-all">
                            End Session
                        </button>
                    </div>
                </header>

                {/* Main Workspace */}
                <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">

                    {/* Left Panel: Video & Comms (Resizable in a real app, fixed here for simplicity) */}
                    <div className="w-full lg:w-[350px] border-r border-white/5 flex flex-col shrink-0 bg-black/20">

                        {/* Primary Video Feed (Peer) */}
                        <div className="relative h-[250px] lg:h-[300px] border-b border-white/5 bg-[#0A0C14] flex items-center justify-center overflow-hidden group">
                            {peers.length > 0 ? (
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <div className="h-24 w-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-3xl font-black text-white shadow-2xl mb-4">
                                        {peers[0].charAt(0)}
                                    </div>
                                    <p className="text-white font-bold">{peers[0]}</p>
                                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">Audio Only (Simulated)</p>
                                </div>
                            ) : (
                                <div className="text-center">
                                    <Users className="h-12 w-12 text-slate-700 mx-auto mb-4" />
                                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Waiting for peer...</p>
                                </div>
                            )}
                            <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-widest border border-white/10">
                                Peer
                            </div>
                        </div>

                        {/* Secondary Feed (Self) & Controls */}
                        <div className="p-4 flex flex-col gap-4 flex-1">
                            <div className="relative h-[150px] rounded-2xl bg-[#0A0C14] border border-white/10 overflow-hidden flex items-center justify-center shadow-inner">
                                <div className="h-16 w-16 rounded-full bg-slate-800 flex items-center justify-center text-xl font-black text-white shadow-lg">
                                    {user?.name?.charAt(0) || 'U'}
                                </div>
                                <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-widest border border-white/10">
                                    You
                                </div>
                                {!isVideoOn && (
                                    <div className="absolute inset-0 bg-black/80 flex items-center justify-center backdrop-blur-sm">
                                        <VideoOff className="h-8 w-8 text-rose-500" />
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center justify-center gap-3 mt-auto mb-4">
                                <button onClick={() => setIsMicOn(!isMicOn)} className={cn("h-12 w-12 rounded-full flex items-center justify-center transition-all", isMicOn ? "bg-white/10 text-white hover:bg-white/20" : "bg-rose-500/20 text-rose-500 border border-rose-500/30")}>
                                    {isMicOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
                                </button>
                                <button onClick={() => setIsVideoOn(!isVideoOn)} className={cn("h-12 w-12 rounded-full flex items-center justify-center transition-all", isVideoOn ? "bg-white/10 text-white hover:bg-white/20" : "bg-rose-500/20 text-rose-500 border border-rose-500/30")}>
                                    {isVideoOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
                                </button>
                                <button className="h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all">
                                    <MonitorUp className="h-5 w-5" />
                                </button>
                                <button onClick={handleLeave} className="h-12 w-12 rounded-full bg-rose-600 hover:bg-rose-500 flex items-center justify-center text-white transition-all shadow-lg shadow-rose-600/20">
                                    <PhoneOff className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel: Synchronized Editor */}
                    <div className="flex-1 flex flex-col min-w-0 bg-[#0A0C14]">
                        <div className="h-12 border-b border-white/5 flex items-center justify-between px-4 bg-white/[0.02]">
                            <div className="flex items-center gap-4">
                                <select
                                    value={language}
                                    onChange={e => setLanguage(e.target.value)}
                                    className="bg-transparent text-white text-[11px] font-black uppercase tracking-widest outline-none cursor-pointer"
                                >
                                    <option value="javascript" className="bg-slate-900">JavaScript</option>
                                    <option value="python" className="bg-slate-900">Python</option>
                                    <option value="java" className="bg-slate-900">Java</option>
                                    <option value="cpp" className="bg-slate-900">C++</option>
                                </select>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                    <Zap className="h-3 w-3 text-emerald-500" /> Synced
                                </span>
                                <button onClick={handleRunCode} className="flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white rounded-lg text-[10px] font-black uppercase tracking-widest transition-all">
                                    <Play className="h-3 w-3" /> Run
                                </button>
                            </div>
                        </div>
                        <div className="flex-1 relative">
                            {/* Line Numbers mock */}
                            <div className="absolute left-0 top-0 bottom-0 w-12 bg-white/[0.02] border-r border-white/5 py-4 flex flex-col items-center text-[11px] font-mono text-slate-600 select-none pointer-events-none">
                                {code.split('\n').map((_, i) => <span key={i} className="leading-6">{i + 1}</span>)}
                            </div>
                            <textarea
                                ref={textareaRef}
                                value={code}
                                onChange={handleCodeChange}
                                spellCheck="false"
                                className="w-full h-full bg-transparent text-slate-300 font-mono text-[13px] leading-6 p-4 pl-16 resize-none outline-none focus:ring-0"
                                placeholder="Type code here..."
                            />
                        </div>
                        {/* Terminal Output Mock */}
                        <div className="h-48 border-t border-white/5 bg-[#05060A] p-4 font-mono text-[11px] text-slate-400 overflow-y-auto">
                            <div className="flex items-center gap-2 text-slate-600 mb-2">
                                <MonitorUp className="h-3 w-3" /> Output Console
                            </div>
                            <p className="text-emerald-500 leading-relaxed">&gt; Ready.</p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
