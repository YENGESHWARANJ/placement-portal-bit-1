import { useState } from "react";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
      <h1 className="text-2xl font-bold text-center mb-2">
        {isLogin ? "Welcome Back 👋" : "Create Account 🚀"}
      </h1>
      <p className="text-center text-gray-500 mb-6">
        {isLogin
          ? "Login to your placement portal"
          : "Register to get started"}
      </p>

      <form className="space-y-4">
        {!isLogin && (
          <input
            type="text"
            placeholder="Full Name"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
        )}

        <input
          type="email"
          placeholder="Email address"
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
        />

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
        >
          {isLogin ? "Login" : "Register"}
        </button>
      </form>

      <div className="text-center mt-6 text-sm">
        {isLogin ? (
          <>
            Don’t have an account?{" "}
            <button
              className="text-indigo-600 font-medium"
              onClick={() => setIsLogin(false)}
            >
              Register
            </button>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <button
              className="text-indigo-600 font-medium"
              onClick={() => setIsLogin(true)}
            >
              Login
            </button>
          </>
        )}
      </div>
    </div>
  );
}
