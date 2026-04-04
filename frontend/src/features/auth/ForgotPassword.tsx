import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, ArrowRight, GraduationCap, ArrowLeft, CheckCircle2 } from "lucide-react";
import { toast } from "react-hot-toast";
import api from "../../services/api";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async () => {
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setLoading(true);
    try {
      await api.post("/auth/forgot-password", { email });
      setSent(true);
      toast.success("Reset link sent! Check your inbox.");
    } catch (err: any) {
      const message = err?.response?.data?.message || "Something went wrong. Please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      {/* Background elements for depth */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-apple-blue/5 blur-3xl" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full bg-apple-blue/5 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        className="w-full max-w-[440px] z-10"
      >
        <div className="apple-card p-10">
          <button
            onClick={() => navigate("/login")}
            className="flex items-center gap-2 text-sm font-semibold text-apple-gray-400 hover:text-apple-gray-900 transition-colors mb-10 group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to Login
          </button>

          {sent ? (
            <div className="text-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-20 h-20 bg-emerald-50 rounded-[1.5rem] flex items-center justify-center mx-auto mb-8"
              >
                <CheckCircle2 className="h-10 w-10 text-emerald-500" />
              </motion.div>
              <h2 className="text-2xl font-bold text-apple-gray-900 tracking-tight mb-4 text-center">Check your inbox</h2>
              <p className="text-apple-gray-400 font-medium mb-10 leading-relaxed">
                We've sent a secure password reset link to <span className="text-apple-gray-900 font-bold">{email}</span>. It will expire in 1 hour.
              </p>

              <div className="space-y-4">
                <button
                  onClick={() => { setSent(false); setEmail(""); }}
                  className="w-full py-4 text-lg font-bold text-apple-gray-900 bg-apple-gray-50 rounded-xl hover:bg-apple-gray-100 transition-all border border-apple-gray-100"
                >
                  Try another email
                </button>
                <button
                  onClick={() => navigate("/login")}
                  className="w-full py-4 text-lg font-bold text-apple-blue hover:underline"
                >
                  Return to sign in
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex flex-col items-center text-center mb-10">
                <div className="w-16 h-16 bg-apple-blue rounded-[1.25rem] flex items-center justify-center shadow-lg shadow-apple-blue/20 mb-6">
                  <Mail className="h-8 w-8 text-slate-900" />
                </div>
                <h2 className="text-3xl font-bold text-apple-gray-900 tracking-tight mb-3">Reset Password</h2>
                <p className="text-apple-blue font-black text-[10px] uppercase tracking-[0.3em] mb-4">BIT Academic Network</p>
                <p className="text-apple-gray-400 font-medium px-2">
                  Enter your email and we'll send you a link to regain access.
                </p>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-base font-semibold text-apple-gray-400 ml-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-apple-gray-300 pointer-events-none" />
                    <input
                      id="forgot-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                      placeholder="you@college.edu"
                      className="apple-input pl-11"
                      required
                    />
                  </div>
                </div>

                <button
                  id="forgot-submit"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="apple-btn-primary w-full py-4 text-lg font-semibold flex items-center justify-center gap-2 mt-2"
                >
                  {loading ? (
                    <div className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  ) : (
                    <>
                      <span>Send reset link</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>

              <div className="mt-8 text-center">
                <p className="text-apple-gray-400 text-sm">
                  Remembered your password?{" "}
                  <button
                    onClick={() => navigate("/login")}
                    className="text-apple-blue font-semibold hover:underline"
                  >
                    Sign In
                  </button>
                </p>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
