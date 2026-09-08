// Canonical Client type — single source of truth (P0-1).
// Merged from: types/client.d.ts (deleted), admin/ClientManagement local,
// coach/progress base fields, pages/Coach User shape.
// NOTE: coach/progress/types.ts keeps its own richer Client (metrics + checkIns
// + goals as string[]) until P0-2 normalizes mock data. ClientGoals widget and
// ClientsPage mocks use goals as string — do not widen to string[] until those
// consumers migrate.

export type ClientStatus = 'active' | 'pending' | 'cancelled';

export interface Client {
  id: string;
  name: string;
  email: string;
  plan: string;
  isActive: boolean;
  joinDate: string;
  lastActive?: string;
  status?: ClientStatus;
  goals?: string;
  progress?: number;
  subscription?: string;
  subscriptionEndDate?: string;
  /** Future bridge to auth session. Auth stays decoupled until backend exists. */
  userId?: string;
}
