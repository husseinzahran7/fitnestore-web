// Canonical Client type — single source of truth for coach roster UI.
// goals stays string (clients.goals column); progress richer Client lives
// in data/progress/types.ts for charts + check-ins.

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
