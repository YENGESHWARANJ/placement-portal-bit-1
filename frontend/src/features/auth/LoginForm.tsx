export default function LoginForm() {
  return (
    <div className="w-full max-w-sm">
      <h2 className="text-2xl font-bold mb-2">Login</h2>
      <p className="text-gray-500 mb-6">
        Enter your credentials to continue
      </p>

      <form className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
        />

        <button className="w-full bg-black text-slate-900 py-3 rounded-lg hover:opacity-90">
          Sign In
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-500">
        Or sign in with
      </div>

      <div className="flex gap-3 mt-4">
        <button className="flex-1 border rounded-lg py-2">Google</button>
        <button className="flex-1 border rounded-lg py-2">GitHub</button>
      </div>
    </div>
  );
}
