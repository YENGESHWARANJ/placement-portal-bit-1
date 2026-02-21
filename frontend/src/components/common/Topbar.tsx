import useAuthStore from "../../store/auth.store";

export default function Topbar() {
  const logout = useAuthStore((s: any) => s.logout);

  return (
    <div className="h-14 bg-white shadow flex justify-end items-center px-4">
      <button className="btn" onClick={logout}>Logout</button>
    </div>
  );
}
