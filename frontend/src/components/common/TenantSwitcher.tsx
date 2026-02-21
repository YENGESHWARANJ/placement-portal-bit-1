import useAuthStore from "../../store/auth.store";

export default function TenantSwitcher() {
  const user = useAuthStore((s) => s.user);

  return <span>Tenant: {user?.tenantId}</span>;
}
