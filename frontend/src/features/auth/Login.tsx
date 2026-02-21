import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, GraduationCap, ArrowRight, Lock, Mail, UserCheck, Briefcase, Eye, EyeOff } from "lucide-react";
import { toast } from "react-hot-toast";
import { useAuth } from "./AuthContext";
import api from "../../services/api";
import { ThemeToggle } from "../../components/ui/ThemeToggle";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("student");

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    const loginToast = toast.loading("Signing you in...");

    try {
      const { data } = await api.post<{ token: string; user: any }>("/auth/login", { email, password });
      login(data.token, data.user);
      toast.success("Welcome back!", { id: loginToast });
      navigate("/dashboard");
    } catch (err: any) {
      const errorData = err?.response?.data;
      if (errorData?.errors && Array.isArray(errorData.errors)) {
        errorData.errors.forEach((e: string) => toast.error(e, { id: loginToast }));
      } else {
        const message = errorData?.message || "Login failed. Please check your credentials.";
        toast.error(message, { id: loginToast });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      // Mock Google Login as tailored to the role tab selected
      const mockUser = role === "student"
        ? { _id: "65cf0e1d5a2d6a001b8e8b01", name: "Google Student", email: "student@gmail.com", role: "student" }
        : { _id: "65cf0e1d5a2d6a001b8e8b02", name: "Google Recruiter", email: "recruiter@gmail.com", role: "recruiter" };

      const mockToken = role === "student" ? "mock-student-token" : "mock-recruiter-token";
      login(mockToken, mockUser);
      navigate("/dashboard");
    }, 1500);
  };

  return (
    <div className="min-h-screen flex bg-slate-50 overflow-hidden">

      {/* Left Side - Dynamic Hero */}
      <div className={`hidden lg:flex w-1/2 relative overflow-hidden transition-all duration-1000 ${role === 'student' ? 'bg-slate-900' : 'bg-blue-900'}`}>

        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] animate-pulse-slow"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/60"></div>

        <div className="relative z-10 flex flex-col justify-center px-16 h-full text-white">
          <div className="flex items-center gap-3 mb-10">
            <div className="p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-lg">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Placement<span className={`${role === 'student' ? 'text-blue-400' : 'text-yellow-400'}`}>Cell</span></h1>
          </div>

          <div className="space-y-6 max-w-lg transition-all duration-500">
            {role === 'student' ? (
              <div className="animate-in slide-in-from-left-8 duration-700">
                <h2 className="text-5xl font-bold leading-tight mb-6">
                  Launch Your <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Dream Career</span>
                </h2>
                <p className="text-slate-300 text-lg leading-relaxed">
                  Access exclusive campus drives, get AI-powered resume feedback, and practice with our voice-enabled interview coach.
                </p>
              </div>
            ) : (
              <div className="animate-in slide-in-from-left-8 duration-700">
                <h2 className="text-5xl font-bold leading-tight mb-6">
                  Discover <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">Top Talent</span>
                </h2>
                <p className="text-slate-300 text-lg leading-relaxed">
                  Streamline your hiring process with AI-driven candidate matching and automated skill assessments.
                </p>
              </div>
            )}
          </div>

          {/* Stats / Validation */}
          <div className="mt-12 flex gap-6">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-4 rounded-xl">
              <p className="text-3xl font-bold">95%</p>
              <p className="text-xs text-slate-400 uppercase tracking-wider">Placement Rate</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-4 rounded-xl">
              <p className="text-3xl font-bold">500+</p>
              <p className="text-xs text-slate-400 uppercase tracking-wider">Top Recruiters</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white relative">
        {/* Page Theme Toggle */}
        <div className="absolute top-8 right-8 z-20">
          <ThemeToggle />
        </div>
        <div className="w-full max-w-md space-y-8">

          {/* Role Toggle Tabs */}
          <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-8">
            <button
              onClick={() => setRole('student')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[11px] font-black uppercase tracking-tight transition-all duration-300 ${role === 'student' ? 'bg-white shadow-md text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <UserCheck className="h-4 w-4" />
              Student
            </button>
            <button
              onClick={() => setRole('recruiter')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[11px] font-black uppercase tracking-tight transition-all duration-300 ${role === 'recruiter' ? 'bg-white shadow-md text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <Briefcase className="h-4 w-4" />
              Recruiter
            </button>
          </div>

          <div className="text-center">
            <h2 className="text-3xl font-black italic text-slate-900 uppercase tracking-tighter">Welcome Back</h2>
            <p className="mt-2 text-[10px] font-black uppercase tracking-widest text-slate-400 italic">
              {role === 'student' ? 'Syncing to academic node...' :
                role === 'recruiter' ? 'Linking to corporate network...' :
                  'Accessing command center...'}
            </p>
          </div>

          <div className="space-y-6">

            <div className="space-y-5">
              <div className="group">
                <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                    placeholder={role === 'student' ? "student@college.edu" : "hr@company.com"}
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all bg-slate-50 focus:bg-white font-medium"
                  />
                </div>
              </div>

              <div className="group">
                <div className="flex justify-between items-center mb-1.5 ml-1">
                  <label className="block text-sm font-medium text-slate-700">Password</label>
                  <button onClick={() => navigate("/forgot-password")} className="text-xs font-semibold text-blue-600 hover:text-blue-500">
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-12 py-3.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all bg-slate-50 focus:bg-white font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-lg shadow-slate-200 hover:shadow-xl hover:scale-[1.01] active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100"
            >
              {loading ? "Authenticating..." : "Sign In to Portal"}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </button>

            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink-0 mx-4 text-slate-400 text-xs uppercase tracking-widest font-semibold">Or continue with</span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>

            <button
              onClick={handleGoogleLogin}
              type="button"
              className="w-full flex items-center justify-center gap-3 bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 font-bold py-3.5 rounded-xl transition-all shadow-sm hover:shadow-md"
            >
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="h-5 w-5" alt="Google" />
              Sign in with Google
            </button>

          </div>

          <p className="text-center text-sm text-slate-500 mt-8">
            Don't have an account?{" "}
            <button onClick={() => navigate("/register")} className="font-bold text-blue-600 hover:text-blue-700 hover:underline">
              Create Account
            </button>
          </p>

          <div className="pt-6 border-t border-slate-100 flex justify-center">
            <button
              onClick={() => navigate("/admin-portal")}
              className="flex items-center gap-2 text-[9px] font-black text-slate-300 hover:text-slate-900 uppercase tracking-[0.4em] transition-all group"
            >
              <Lock className="h-3 w-3 group-hover:text-blue-500 transition-colors" /> Secure Administrative Access
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
