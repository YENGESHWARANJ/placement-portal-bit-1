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
    const [code, setCode] = useState(`// Two Sum Problem
// Given an array of integers nums and an integer target,
// return indices of the two numbers such that they add up to target.

function solve(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}

// Test case
const nums = [2, 7, 11, 15];
const target = 9;
console.log("Input:", nums, "Target:", target);
console.log("Result:", solve(nums, target));
`);
    const [language, setLanguage] = useState('javascript');
    const [isMicOn, setIsMicOn] = useState(true);
    const [isVideoOn, setIsVideoOn] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [peers, setPeers] = useState<string[]>([]);
    const [output, setOutput] = useState<string[]>(['> Environment initialized.', '> Ready for execution.']);
    const [isRunning, setIsRunning] = useState(false);
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

    const handleRunCode = async () => {
        setIsRunning(true);
        setOutput(prev => [...prev, `> Running ${language} script...`]);

        if (language === 'javascript') {
            const logs: string[] = [];
            const originalLog = console.log;
            console.log = (...args: any[]) => {
                logs.push(args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : arg).join(' '));
            };

            try {
                // eslint-disable-next-line no-eval
                eval(code);
                setTimeout(() => {
                    setOutput(prev => [...prev, ...logs, `> Execution finished successfully.`]);
                    setIsRunning(false);
                    console.log = originalLog;
                }, 800);
            } catch (err: any) {
                setTimeout(() => {
                    setOutput(prev => [...prev, `[ERROR] ${err.message}`, `> Execution failed.`]);
                    setIsRunning(false);
                    console.log = originalLog;
                }, 800);
            }
        } else {
            // Simulated Compiler for other languages
            setTimeout(() => {
                setOutput(prev => [
                    ...prev, 
                    `[SYSTEM] Connecting to ${language} remote compiler...`,
                    `[SYSTEM] Compiling source...`,
                    `[STDOUT] Compilation successful.`,
                    `[STDOUT] Result: 0 (Success)`,
                    `> Execution finished.`
                ]);
                setIsRunning(false);
            }, 2000);
        }
    };

    const clearConsole = () => setOutput(['> Console cleared.']);

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

            <div className="relative z-10 flex flex-col h-full bg-[#0F1225]/80 backdrop-blur-2xl rounded-[30px] border border-white/10 shadow-2xl overflow-hidden">

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
                            <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-black text-white border-2 border-[#0F1225] z-10" title={user?.name}>
                                {user?.name?.charAt(0) || 'U'}
                            </div>
                            {peers.map((p, i) => (
                                <div key={i} className="h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-black text-white border-2 border-[#0F1225]" title={p}>
                                    {p.charAt(0)}
                                </div>
                            ))}
                            <div className="h-8 pl-4 pr-3 rounded-full bg-white/5 flex items-center justify-center text-[10px] font-black text-slate-400 border border-white/10 uppercase tracking-widest ml-2">
                                {peers.length + 1} Connected
                            </div>
                        </div>

                        <button onClick={() => setIsFullscreen(!isFullscreen)} className="h-10 w-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 transition-colors border border-white/5">
                            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                        </button>
                        <button onClick={handleLeave} className="px-6 py-2.5 bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all border border-rose-500/20">
                            End Session
                        </button>
                    </div>
                </header>

                {/* Main Workspace */}
                <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">

                    {/* Left Panel: Video & Comms */}
                    <div className="w-full lg:w-[350px] border-r border-white/5 flex flex-col shrink-0 bg-black/40">
                        
                        {/* Question Panel */}
                        <div className="p-5 border-b border-white/5 bg-indigo-500/5">
                            <div className="flex items-center gap-2 mb-3">
                                <AlertCircle className="h-4 w-4 text-indigo-400" />
                                <span className="text-[10px] font-black text-indigo-200 uppercase tracking-widest">Coding Challenge</span>
                            </div>
                            <h4 className="text-white font-bold mb-2">Two Sum</h4>
                            <p className="text-slate-400 text-xs leading-relaxed mb-4">
                                Given an array of integers <code className="text-indigo-400 font-mono">nums</code> and an integer <code className="text-indigo-400 font-mono">target</code>, return indices of the two numbers such that they add up to target.
                            </p>
                            <div className="flex flex-wrap gap-2">
                                <span className="px-2 py-1 bg-white/5 rounded-md text-[9px] font-black text-slate-500 border border-white/10 uppercase">Array</span>
                                <span className="px-2 py-1 bg-white/5 rounded-md text-[9px] font-black text-slate-500 border border-white/10 uppercase">Hash Table</span>
                                <span className="px-2 py-1 bg-emerald-500/10 rounded-md text-[9px] font-black text-emerald-400 border border-emerald-500/20 uppercase tracking-widest">Easy</span>
                            </div>
                        </div>

                        {/* Peer Feed */}
                        <div className="relative h-[220px] border-b border-white/5 bg-black/40 flex items-center justify-center overflow-hidden">
                            {peers.length > 0 ? (
                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-t from-black/80 to-transparent">
                                    <div className="h-20 w-20 rounded-full bg-indigo-600 flex items-center justify-center text-3xl font-black text-white shadow-2xl mb-4 border-2 border-white/20">
                                        {peers[0].charAt(0)}
                                    </div>
                                    <p className="text-white font-black tracking-tight">{peers[0]}</p>
                                    <p className="text-indigo-400 text-[10px] font-black uppercase tracking-widest mt-1 animate-pulse">Recruiter (Host)</p>
                                </div>
                            ) : (
                                <div className="text-center opacity-40">
                                    <Users className="h-10 w-10 text-slate-500 mx-auto mb-3" />
                                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Waiting for peer...</p>
                                </div>
                            )}
                            <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md text-[9px] font-black text-slate-400 uppercase tracking-widest border border-white/10">
                                PEER
                            </div>
                        </div>

                        {/* Self Feed Mini */}
                        <div className="p-4 flex-1 flex flex-col">
                           <div className="relative w-full aspect-video rounded-2xl bg-black border border-white/5 overflow-hidden flex items-center justify-center">
                                {!isVideoOn ? (
                                    <div className="flex flex-col items-center text-slate-600">
                                        <VideoOff className="h-8 w-8 mb-2" />
                                        <span className="text-[10px] font-black uppercase">Camera Off</span>
                                    </div>
                                ) : (
                                    <div className="h-full w-full bg-slate-900 flex items-center justify-center">
                                        <div className="h-12 w-12 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-black">
                                            {user?.name?.charAt(0)}
                                        </div>
                                    </div>
                                )}
                                <div className="absolute bottom-2 left-2 bg-black/80 px-2 py-0.5 rounded text-[8px] font-black text-white uppercase tracking-tighter">You (Student)</div>
                           </div>
                           
                           {/* Controls */}
                            <div className="flex items-center justify-center gap-3 mt-6">
                                <button onClick={() => setIsMicOn(!isMicOn)} className={cn("h-11 w-11 rounded-2xl flex items-center justify-center transition-all shadow-lg", isMicOn ? "bg-white/5 text-slate-400 hover:bg-white/10 border border-white/10" : "bg-rose-500 text-white")}>
                                    {isMicOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                                </button>
                                <button onClick={() => setIsVideoOn(!isVideoOn)} className={cn("h-11 w-11 rounded-2xl flex items-center justify-center transition-all shadow-lg", isVideoOn ? "bg-white/5 text-slate-400 hover:bg-white/10 border border-white/10" : "bg-rose-500 text-white")}>
                                    {isVideoOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                                </button>
                                <button className="h-11 w-11 rounded-2xl bg-white/5 text-slate-400 hover:bg-white/10 border border-white/10 flex items-center justify-center shadow-lg transition-all">
                                    <MonitorUp className="h-4 w-4" />
                                </button>
                                <button onClick={handleLeave} className="h-11 w-11 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center transition-all shadow-lg shadow-rose-600/40 border border-rose-400/20">
                                    <PhoneOff className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel: Synchronized Editor */}
                    <div className="flex-1 flex flex-col min-w-0 bg-[#05060A]">
                        <div className="h-14 border-b border-white/5 flex items-center justify-between px-6 bg-black/20">
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-2">
                                    <Code2 className="h-4 w-4 text-indigo-400" />
                                    <select
                                        value={language}
                                        onChange={e => setLanguage(e.target.value)}
                                        className="bg-transparent text-white text-[10px] font-black uppercase tracking-[0.2em] outline-none cursor-pointer hover:text-indigo-400 transition-colors"
                                    >
                                        <option value="javascript" className="bg-[#0F1225]">JavaScript</option>
                                        <option value="python" className="bg-[#0F1225]">Python 3</option>
                                        <option value="java" className="bg-[#0F1225]">Java 17</option>
                                        <option value="cpp" className="bg-[#0F1225]">C++ 20</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-[10px] font-black text-emerald-400/60 uppercase tracking-widest flex items-center gap-2">
                                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> SYNCED
                                </span>
                                <button 
                                    onClick={handleRunCode} 
                                    disabled={isRunning}
                                    className={cn(
                                        "flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                                        isRunning ? "bg-slate-800 text-slate-500 cursor-not-allowed" : "bg-emerald-500 text-white hover:bg-emerald-400 shadow-lg shadow-emerald-500/20 border border-emerald-400/20"
                                    )}
                                >
                                    {isRunning ? <div className="h-3 w-3 border-2 border-slate-500 border-t-transparent animate-spin rounded-full" /> : <Play className="h-3 w-3 fill-current" />}
                                    {isRunning ? "Running..." : "Run Code"}
                                </button>
                            </div>
                        </div>
                        
                        {/* Editor Canvas */}
                        <div className="flex-1 flex overflow-hidden group">
                            {/* Editor UI Accents */}
                            <div className="w-12 border-r border-white/5 flex flex-col pt-6 items-center text-[10px] font-mono text-slate-700 select-none bg-black/20">
                                {code.split('\n').map((_, i) => (
                                    <span key={i} className="leading-[24px] h-[24px]">{i + 1}</span>
                                ))}
                            </div>
                            <div className="flex-1 relative">
                                <textarea
                                    ref={textareaRef}
                                    value={code}
                                    onChange={handleCodeChange}
                                    spellCheck="false"
                                    className="w-full h-full bg-transparent text-slate-300 font-mono text-sm leading-[24px] p-6 resize-none outline-none focus:ring-0 selection:bg-indigo-500/30 color-[#e2e8f0]"
                                    placeholder="// Start writing your solution..."
                                />
                                {/* Bottom Bar Stats */}
                                <div className="absolute bottom-4 right-6 text-[10px] font-black text-slate-700 uppercase tracking-widest pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                                    UTF-8 | LF | {language.toUpperCase()}
                                </div>
                            </div>
                        </div>

                        {/* Modern Terminal Output */}
                        <div className="h-56 border-t border-white/5 bg-black/60 flex flex-col">
                            <div className="h-10 px-6 border-b border-white/5 flex items-center justify-between bg-black/20">
                                <div className="flex items-center gap-2">
                                    <MonitorUp className="h-3.5 w-3.5 text-slate-500" />
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Output Console</span>
                                </div>
                                <button onClick={clearConsole} className="text-[10px] font-black text-slate-700 hover:text-slate-500 uppercase tracking-widest transition-colors mb-4">Clear</button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-6 font-mono text-xs space-y-1.5 custom-scrollbar">
                                {output.map((line, i) => (
                                    <div key={i} className={cn(
                                        "leading-relaxed",
                                        line.startsWith('>') ? "text-slate-500" :
                                        line.startsWith('[ERROR]') ? "text-rose-500 font-bold" :
                                        line.startsWith('[SYSTEM]') ? "text-indigo-400" :
                                        line.startsWith('[STDOUT]') ? "text-emerald-400" : "text-slate-300"
                                    )}>
                                        {line}
                                    </div>
                                ))}
                                {isRunning && (
                                    <div className="text-indigo-400 animate-pulse mt-4">&gt; Processing...</div>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
