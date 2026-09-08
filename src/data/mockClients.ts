import { Client } from '@/types/client';

// NOTE (P0-2 Turn 1): two separate rosters exist with overlapping ids 1-4 but
// DIFFERENT people (coach view vs admin view). Do not merge blindly —
// reconcile ids/names in Turn 2 or when backend arrives.

export const mockClients: Client[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    plan: 'Premium',
    isActive: true,
    joinDate: '2023-05-15',
    lastActive: '2023-10-10',
    goals: 'Weight loss, Muscle gain',
    progress: 75,
    subscription: '6 months',
    subscriptionEndDate: '2024-11-15',
  },
  {
    id: '2',
    name: 'Emily Davis',
    email: 'emily@example.com',
    plan: 'Basic',
    isActive: false,
    joinDate: '2023-06-22',
    lastActive: '2023-08-01',
    goals: 'Improve endurance',
    progress: 30,
  },
  {
    id: '3',
    name: 'Michael Johnson',
    email: 'michael@example.com',
    plan: 'Standard',
    isActive: true,
    joinDate: '2023-03-10',
    lastActive: '2023-10-08',
    goals: 'Marathon preparation',
    progress: 60,
    subscription: '1 year',
    subscriptionEndDate: '2025-03-10',
  },
  {
    id: '4',
    name: 'Sara Wilson',
    email: 'sara@example.com',
    plan: 'Premium',
    isActive: true,
    joinDate: '2023-01-05',
    lastActive: '2023-10-09',
    goals: 'Yoga flexibility',
    progress: 85,
    subscription: '3 months',
    subscriptionEndDate: '2024-12-05',
  },
];

export const adminClients: Client[] = [
  { id: '1', name: 'Alex Johnson', email: 'alex@example.com', plan: 'Premium', status: 'active', isActive: true, joinDate: '2023-06-15', subscription: '3 months' },
  { id: '2', name: 'Sarah Williams', email: 'sarah@example.com', plan: 'Standard', status: 'active', isActive: true, joinDate: '2023-07-20', subscription: '1 year' },
  { id: '3', name: 'Michael Brown', email: 'michael@example.com', plan: 'Premium', status: 'active', isActive: true, joinDate: '2023-05-10', subscription: '6 months' },
  { id: '4', name: 'Emily Davis', email: 'emily@example.com', plan: 'Basic', status: 'pending', isActive: false, joinDate: '2023-09-05' },
  { id: '5', name: 'James Wilson', email: 'james@example.com', plan: 'Standard', status: 'cancelled', isActive: false, joinDate: '2023-03-22' },
  { id: '6', name: 'Jessica Martinez', email: 'jessica@example.com', plan: 'Premium', status: 'active', isActive: true, joinDate: '2023-08-17', subscription: '1 month' },
  { id: '7', name: 'Ryan Taylor', email: 'ryan@example.com', plan: 'Basic', status: 'pending', isActive: false, joinDate: '2023-09-01' },
];

export const createMockClient = (overrides?: Partial<Client>): Client => ({
  id: `client-${Date.now()}`,
  name: 'New Client',
  email: 'client@example.com',
  plan: 'Basic',
  isActive: false,
  status: 'pending',
  joinDate: new Date().toISOString().slice(0, 10),
  ...overrides,
});
