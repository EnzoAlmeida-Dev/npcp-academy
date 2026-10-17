import { ROLE_LABELS } from "@/lib/auth/roles";
import { getCurrentProfile } from "@/lib/auth/session";

export default async function DashboardPage() {
  const profile = await getCurrentProfile();
  if (!profile) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p>
        Bem-vindo{profile.display_name ? `, ${profile.display_name}` : ""}.
      </p>
      <p className="text-sm text-zinc-600">
        Papel: {ROLE_LABELS[profile.role]}
      </p>
    </div>
  );
}
