// Types for progress tracking components

export interface MetricData {
  date: string;
  value: number;
}

export interface CheckIn {
  id: string;
  date: string;
  notes: string;
  completed: boolean;
  metrics: {
    weight?: number;
    bodyFat?: number;
    strength?: number;
    endurance?: number;
  };
}

export interface Client {
  id: string;
  name: string;
  email: string;
  plan: string;
  isActive: boolean;
  goals: string[];
  progress: number;
  metrics: {
    weight: MetricData[];
    bodyFat: MetricData[];
    strength: MetricData[];
    endurance: MetricData[];
  };
  checkIns: CheckIn[];
}

export type MetricType = 'weight' | 'bodyFat' | 'strength' | 'endurance';

export interface MetricChangeResult {
  value: number;
  isPositive: boolean;
}