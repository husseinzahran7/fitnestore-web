import { addDays } from 'date-fns';

// NOTE: coach sessions and admin appointments have DIFFERENT shapes
// (string date+slots vs Date objects + location). Kept verbatim —
// unify against backend tables later, not by rewriting component logic now.

// --- Coach schedule (from pages/coach/SchedulePage.tsx) ---

export interface ScheduleItem {
  id: string;
  clientName: string;
  clientId: string;
  date: string;
  startTime: string;
  endTime: string;
  sessionType: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  notes?: string;
}

export const mockSchedule: ScheduleItem[] = [
  {
    id: '1',
    clientName: 'John Doe',
    clientId: '1',
    date: '2023-10-12',
    startTime: '09:00',
    endTime: '10:00',
    sessionType: 'Personal Training',
    status: 'upcoming',
    notes: 'Focus on upper body strength',
  },
  {
    id: '2',
    clientName: 'Emily Davis',
    clientId: '2',
    date: '2023-10-12',
    startTime: '11:00',
    endTime: '12:00',
    sessionType: 'Nutrition Consultation',
    status: 'upcoming',
  },
  {
    id: '3',
    clientName: 'Michael Johnson',
    clientId: '3',
    date: '2023-10-11',
    startTime: '14:00',
    endTime: '15:00',
    sessionType: 'Personal Training',
    status: 'completed',
    notes: 'Made good progress on cardio endurance',
  },
  {
    id: '4',
    clientName: 'Sara Wilson',
    clientId: '4',
    date: '2023-10-11',
    startTime: '16:00',
    endTime: '17:00',
    sessionType: 'Yoga Session',
    status: 'cancelled',
    notes: 'Client had to cancel due to work emergency',
  },
  {
    id: '5',
    clientName: 'John Doe',
    clientId: '1',
    date: '2023-10-14',
    startTime: '09:00',
    endTime: '10:00',
    sessionType: 'Personal Training',
    status: 'upcoming',
    notes: 'Focus on lower body strength',
  },
];

// --- Admin appointments (from components/admin/ScheduleManagement.tsx) ---

export interface AppointmentClient {
  id: string;
  name: string;
  email: string;
}

export interface AppointmentType {
  id: string;
  client: AppointmentClient;
  date: Date;
  time: string;
  duration: string;
  type: string;
  location: string;
  notes?: string;
}

export const initialAppointments: AppointmentType[] = [
  {
    id: '1',
    client: { id: '101', name: 'Alex Johnson', email: 'alex@example.com' },
    date: new Date(),
    time: '09:00 AM',
    duration: '60 min',
    type: 'Personal Training',
    location: 'Main Gym',
    notes: 'Focus on upper body strength',
  },
  {
    id: '2',
    client: { id: '102', name: 'Sarah Williams', email: 'sarah@example.com' },
    date: new Date(),
    time: '11:00 AM',
    duration: '45 min',
    type: 'Nutrition Consultation',
    location: 'Office',
    notes: 'Review meal plan progress',
  },
  {
    id: '3',
    client: { id: '103', name: 'Michael Brown', email: 'michael@example.com' },
    date: addDays(new Date(), 1),
    time: '10:00 AM',
    duration: '60 min',
    type: 'Personal Training',
    location: 'Main Gym',
  },
  {
    id: '4',
    client: { id: '104', name: 'Emily Davis', email: 'emily@example.com' },
    date: addDays(new Date(), 1),
    time: '03:00 PM',
    duration: '30 min',
    type: 'Progress Assessment',
    location: 'Office',
  },
  {
    id: '5',
    client: { id: '105', name: 'James Wilson', email: 'james@example.com' },
    date: addDays(new Date(), 2),
    time: '09:00 AM',
    duration: '60 min',
    type: 'Personal Training',
    location: 'Main Gym',
  },
];
