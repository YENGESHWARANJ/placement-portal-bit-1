import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-gray-900 text-white p-4">
      <h2 className="text-xl mb-6">Placement Portal</h2>

      <nav className="space-y-2">
        <Link to="/admin/dashboard">Dashboard</Link>
        <Link to="/admin/users">Users</Link>
        <Link to="/admin/tenants">Tenants</Link>
      </nav>
    </aside>
  );
}
