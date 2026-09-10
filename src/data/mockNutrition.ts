// Moved from src/pages/coach/NutritionPage.tsx (sole consumer).

export interface NutritionPlan {
  id: string;
  title: string;
  description: string;
  tags: string[];
  createdAt: string;
  clientCount: number;
  isTemplate: boolean;
}

export interface MealPlan {
  id: string;
  clientName: string;
  clientId: string;
  planName: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'completed' | 'draft';
  adherenceRate?: number;
  mealCount?: number;
}

export const mockNutritionPlans: NutritionPlan[] = [
  {
    id: '1',
    title: 'High Protein Weight Loss Plan',
    description: 'A balanced nutrition plan focused on high protein intake for weight loss while preserving muscle mass.',
    tags: ['weight loss', 'high protein', 'low carb'],
    createdAt: '2023-07-15',
    clientCount: 5,
    isTemplate: true,
  },
  {
    id: '2',
    title: 'Vegan Athlete Nutrition',
    description: 'Plant-based nutrition plan designed for athletes with high energy demands.',
    tags: ['vegan', 'high energy', 'plant-based'],
    createdAt: '2023-08-22',
    clientCount: 3,
    isTemplate: true,
  },
  {
    id: '3',
    title: 'Balanced Maintenance Diet',
    description: 'Well-rounded nutrition plan for maintaining current weight and supporting overall health.',
    tags: ['maintenance', 'balanced', 'general health'],
    createdAt: '2023-09-10',
    clientCount: 7,
    isTemplate: true,
  },
  {
    id: '4',
    title: 'Muscle Building Plan',
    description: 'High calorie nutrition plan focused on supporting muscle growth and recovery.',
    tags: ['muscle gain', 'bulking', 'high calorie'],
    createdAt: '2023-06-05',
    clientCount: 4,
    isTemplate: true,
  },
];

export const mockClientMealPlans: MealPlan[] = [
  {
    id: '1',
    clientName: 'John Doe',
    clientId: '1',
    planName: 'Custom Weight Loss Plan',
    startDate: '2023-09-01',
    endDate: '2023-12-01',
    status: 'active',
    adherenceRate: 85,
  },
  {
    id: '2',
    clientName: 'Emily Davis',
    clientId: '2',
    planName: 'Vegan Athlete Nutrition',
    startDate: '2023-08-15',
    endDate: '2023-11-15',
    status: 'active',
    adherenceRate: 92,
  },
  {
    id: '3',
    clientName: 'Michael Johnson',
    clientId: '3',
    planName: 'Marathon Training Diet',
    startDate: '2023-07-10',
    endDate: '2023-10-10',
    status: 'completed',
    adherenceRate: 88,
  },
  {
    id: '4',
    clientName: 'Sara Wilson',
    clientId: '4',
    planName: 'Recovery Nutrition Plan',
    startDate: '2023-09-20',
    endDate: '2023-12-20',
    status: 'active',
    adherenceRate: 78,
  },
  {
    id: '5',
    clientName: 'Alex Thompson',
    clientId: '5',
    planName: 'Custom Muscle Building Plan',
    startDate: '2023-10-01',
    endDate: '2024-01-01',
    status: 'draft',
  },
];
