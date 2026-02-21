export default function Register() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">

      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl rounded-xl p-10 shadow-xl">

        <h1 className="text-3xl font-bold text-white mb-6">
          Create Account
        </h1>

        <form className="space-y-4">

          <input
            placeholder="Company / University Name"
            className="w-full px-4 py-3 rounded bg-white/20 text-white outline-none"
          />

          <input
            placeholder="Admin Email"
            className="w-full px-4 py-3 rounded bg-white/20 text-white outline-none"
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 rounded bg-white/20 text-white outline-none"
          />

          <button className="w-full py-3 rounded bg-gradient-to-r from-indigo-500 to-pink-500 text-white font-semibold">
            Register Tenant
          </button>

        </form>

      </div>
    </div>
  );
}
