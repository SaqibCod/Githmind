import { RepoListView } from "@/components/dashboard/repo-list-view";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { RequireAuth } from "@/components/providers/require-auth";

/**
 * Repositories, ported from docs/design/githMind UI Design.html → "githMind
 * Dashboard".
 */
export default function DashboardPage() {
  return (
    <RequireAuth>
      <DashboardShell>
        <RepoListView />
      </DashboardShell>
    </RequireAuth>
  );
}
