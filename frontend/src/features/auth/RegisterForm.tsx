export default function RegisterForm() {
  return (
    <div className="w-full max-w-sm">
      <h2 className="text-2xl font-bold mb-2">Create Account</h2>
      <p className="text-gray-500 mb-6">
        Start your placement journey today
      </p>

      <form className="space-y-4">
        <input
          type="text"
          placeholder="Full Name"
          className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
        />

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

        <button className="w-full bg-black text-white py-3 rounded-lg hover:opacity-90">
          Register
        </button>
      </form>

      <p className="text-xs text-gray-500 mt-4 text-center">
        By signing up, you agree to our Terms & Privacy Policy
      </p>
    </div>
  );
}
