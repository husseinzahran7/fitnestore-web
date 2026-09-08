
export interface WorkoutExercise {
  name: string;
  sets: number;
  reps: string;
  weight?: string;
}

export interface WorkoutSession {
  id: string;
  title: string;
  day: string;
  time: string;
  duration: string;
  completed: boolean;
  description: string;
  exercises: WorkoutExercise[];
}

export type WeeklyWorkouts = Record<string, WorkoutSession[]>;
