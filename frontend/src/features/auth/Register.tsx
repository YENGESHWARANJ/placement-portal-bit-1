import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  GraduationCap,
  ArrowRight,
  User,
  Mail,
  Lock,
  ShieldCheck,
  CheckCircle2,
  Briefcase,
  Zap,
  Eye,
  EyeOff
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useAuth } from "./AuthContext";
import api from "../../services/api";
import { ThemeToggle } from "../../components/ui/ThemeToggle";

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("student");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    const registerToast = toast.loading("Creating your account...");

    try {
      const { data } = await api.post<{ token: string; user: any }>("/auth/register", { name, email, password, role });
      login(data.token, data.user);
      toast.success("Account created successfully! Welcome to PlacementCell.", { id: registerToast });
      navigate("/dashboard");
    } catch (err: any) {
      const errorData = err?.response?.data;
      if (errorData?.errors && Array.isArray(errorData.errors)) {
        // Display each validation error
        errorData.errors.forEach((e: string) => toast.error(e, { id: registerToast }));
      } else {
        const message = errorData?.message || "Registration failed. Please check your details.";
        toast.error(message, { id: registerToast });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 overflow-hidden">

      {/* Left Side - Dynamic Hero */}
      <div className={`hidden lg:flex w-1/2 relative overflow-hidden transition-all duration-1000 ${role === 'student' ? 'bg-slate-900 text-white' : 'bg-blue-900 text-white'}`}>

        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] animate-pulse-slow"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/60"></div>

        <div className="relative z-10 flex flex-col justify-center px-16 h-full">
          <div className="flex items-center gap-3 mb-10 group cursor-pointer" onClick={() => navigate("/login")}>
            <div className="p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-lg group-hover:scale-110 transition-transform">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Placement<span className="text-blue-400">Cell</span></h1>
          </div>

          <div className="space-y-8 max-w-lg transition-all duration-500">
            <div className="animate-in slide-in-from-left-8 duration-700">
              <h2 className="text-5xl font-bold leading-tight mb-6">
                Join the <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Next Generation</span>
                <br />of Professionals
              </h2>
              <p className="text-slate-300 text-lg leading-relaxed mb-8">
                Create your account to unlock personalized job matches, AI interview prep, and direct connections with top hiring managers.
              </p>

              <div className="space-y-4">
                {[
                  { icon: CheckCircle2, text: "Verified Recruitment Drives", color: "text-green-400" },
                  { icon: Zap, text: "AI-Powered Resume Scoring", color: "text-blue-400" },
                  { icon: Briefcase, text: "Direct Chat with HRs", color: "text-purple-400" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
                    <item.icon className={`h-6 w-6 ${item.color}`} />
                    <span className="font-medium">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Registration Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white relative overflow-y-auto">
        <div className="absolute top-8 right-8 z-20">
          <ThemeToggle />
        </div>
        <div className="w-full max-w-md space-y-8 my-10">

          <div className="text-center">
            <h2 className="text-3xl font-bold text-slate-900">Create Account</h2>
            <p className="mt-2 text-slate-500">Choose your role and start your journey</p>
          </div>

          <div className="space-y-6">

            <div className="space-y-5">

              {/* Role Selection Tabs */}
              <div className="flex bg-slate-100 p-1 rounded-2xl mb-8">
                <button
                  onClick={() => setRole('student')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${role === 'student' ? 'bg-white shadow-md text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <User className="h-4 w-4" />
                  Student
                </button>
                <button
                  onClick={() => setRole('recruiter')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${role === 'recruiter' ? 'bg-white shadow-md text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <Briefcase className="h-4 w-4" />
                  Recruiter
                </button>
              </div>

              <div className="group">
                <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all bg-slate-50 focus:bg-white font-medium"
                  />
                </div>
              </div>

              <div className="group">
                <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@college.edu"
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all bg-slate-50 focus:bg-white font-medium"
                  />
                </div>
              </div>

              <div className="group">
                <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
          </div>

          <button
            onClick={handleRegister}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-lg shadow-slate-200 hover:shadow-xl hover:scale-[1.01] active:scale-[0.98] disabled:opacity-70"
          >
            {loading ? "Creating Account..." : "Start Your Journey"}
            {!loading && <ArrowRight className="h-4 w-4" />}
          </button>

          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink-0 mx-4 text-slate-400 text-xs uppercase tracking-widest font-semibold">Or join with</span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 font-bold py-3.5 rounded-xl transition-all shadow-sm hover:shadow-md"
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="h-5 w-5" alt="Google" />
            Sign up with Google
          </button>

        </div>

        <p className="text-center text-sm text-slate-500">
          Already have an account?{" "}
          <button onClick={() => navigate("/login")} className="font-bold text-blue-600 hover:text-blue-700 hover:underline">
            Sign In
          </button>
        </p>

      </div>
    </div>

  );
}
