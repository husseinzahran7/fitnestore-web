import { Client } from './types';

// Mock data for weight tracking
export const weightData = [
  { date: '2024-01', value: 85 },
  { date: '2024-02', value: 83 },
  { date: '2024-03', value: 82 },
  { date: '2024-04', value: 80 },
  { date: '2024-05', value: 79 },
  { date: '2024-06', value: 78 },
  { date: '2024-07', value: 77 },
  { date: '2024-08', value: 76 },
  { date: '2024-09', value: 75 },
];

// Mock data for body fat tracking
export const bodyFatData = [
  { date: '2024-01', value: 22 },
  { date: '2024-02', value: 21.5 },
  { date: '2024-03', value: 21 },
  { date: '2024-04', value: 20 },
  { date: '2024-05', value: 19.5 },
  { date: '2024-06', value: 19 },
  { date: '2024-07', value: 18 },
  { date: '2024-08', value: 17.5 },
  { date: '2024-09', value: 17 },
];

// Mock data for strength tracking
export const strengthData = [
  { date: '2024-01', value: 100 },
  { date: '2024-02', value: 105 },
  { date: '2024-03', value: 110 },
  { date: '2024-04', value: 115 },
  { date: '2024-05', value: 120 },
  { date: '2024-06', value: 125 },
  { date: '2024-07', value: 130 },
  { date: '2024-08', value: 135 },
  { date: '2024-09', value: 140 },
];

// Mock data for endurance tracking
export const enduranceData = [
  { date: '2024-01', value: 15 },
  { date: '2024-02', value: 18 },
  { date: '2024-03', value: 20 },
  { date: '2024-04', value: 22 },
  { date: '2024-05', value: 25 },
  { date: '2024-06', value: 27 },
  { date: '2024-07', value: 30 },
  { date: '2024-08', value: 32 },
  { date: '2024-09', value: 35 },
];

// Mock clients data
export const mockClients: Client[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    plan: 'Premium',
    isActive: true,
    goals: ['Weight loss', 'Muscle gain', 'Improve strength'],
    progress: 75,
    metrics: {
      weight: weightData,
      bodyFat: bodyFatData,
      strength: strengthData,
      endurance: enduranceData
    },
    checkIns: [
      {
        id: 'c1',
        date: '2024-09-01',
        notes: 'Completed all workouts, feeling good about progress',
        completed: true,
        metrics: {
          weight: 75,
          bodyFat: 17,
          strength: 140,
          endurance: 35
        }
      },
      {
        id: 'c2',
        date: '2024-08-01',
        notes: 'Missed one workout due to illness, otherwise good week',
        completed: true,
        metrics: {
          weight: 76,
          bodyFat: 17.5,
          strength: 135,
          endurance: 32
        }
      },
      {
        id: 'c3',
        date: '2024-07-01',
        notes: 'Great progress on strength training',
        completed: true,
        metrics: {
          weight: 77,
          bodyFat: 18,
          strength: 130,
          endurance: 30
        }
      }
    ]
  },
  {
    id: '3',
    name: 'Michael Johnson',
    email: 'michael@example.com',
    plan: 'Standard',
    isActive: true,
    goals: ['Marathon preparation', 'Endurance improvement'],
    progress: 60,
    metrics: {
      weight: [
        { date: '2024-01', value: 70 },
        { date: '2024-03', value: 70 },
        { date: '2024-05', value: 69 },
        { date: '2024-07', value: 68 },
        { date: '2024-09', value: 67 },
      ],
      bodyFat: [
        { date: '2024-01', value: 15 },
        { date: '2024-03', value: 14.5 },
        { date: '2024-05', value: 14 },
        { date: '2024-07', value: 13.5 },
        { date: '2024-09', value: 13 },
      ],
      strength: [
        { date: '2024-01', value: 90 },
        { date: '2024-03', value: 95 },
        { date: '2024-05', value: 100 },
        { date: '2024-07', value: 105 },
        { date: '2024-09', value: 110 },
      ],
      endurance: [
        { date: '2024-01', value: 30 },
        { date: '2024-03', value: 35 },
        { date: '2024-05', value: 40 },
        { date: '2024-07', value: 45 },
        { date: '2024-09', value: 50 },
      ]
    },
    checkIns: [
      {
        id: 'c4',
        date: '2024-09-01',
        notes: 'Completed 20-mile run, feeling ready for marathon',
        completed: true,
        metrics: {
          weight: 67,
          endurance: 50
        }
      },
      {
        id: 'c5',
        date: '2024-07-01',
        notes: 'Increased running distance by 15%',
        completed: true,
        metrics: {
          weight: 68,
          endurance: 45
        }
      }
    ]
  },
  {
    id: '4',
    name: 'Sara Wilson',
    email: 'sara@example.com',
    plan: 'Premium',
    isActive: true,
    goals: ['Yoga flexibility', 'Core strength'],
    progress: 85,
    metrics: {
      weight: [
        { date: '2024-01', value: 60 },
        { date: '2024-03', value: 60 },
        { date: '2024-05', value: 59 },
        { date: '2024-07', value: 59 },
        { date: '2024-09', value: 58 },
      ],
      bodyFat: [
        { date: '2024-01', value: 20 },
        { date: '2024-03', value: 19 },
        { date: '2024-05', value: 18.5 },
        { date: '2024-07', value: 18 },
        { date: '2024-09', value: 17.5 },
      ],
      strength: [
        { date: '2024-01', value: 50 },
        { date: '2024-03', value: 55 },
        { date: '2024-05', value: 60 },
        { date: '2024-07', value: 65 },
        { date: '2024-09', value: 70 },
      ],
      endurance: [
        { date: '2024-01', value: 20 },
        { date: '2024-03', value: 22 },
        { date: '2024-05', value: 25 },
        { date: '2024-07', value: 27 },
        { date: '2024-09', value: 30 },
      ]
    },
    checkIns: [
      {
        id: 'c6',
        date: '2024-09-05',
        notes: 'Mastered advanced yoga poses this month',
        completed: true,
        metrics: {
          weight: 58,
          strength: 70
        }
      }
    ]
  }
];