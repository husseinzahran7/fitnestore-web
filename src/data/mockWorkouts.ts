import { WeeklyWorkouts, WorkoutSession } from '@/types/workout';

// Moved from src/types/workout.ts (types stay there). Single consumer:
// components/dashboard/WorkoutSchedule.tsx.

export const weeklyWorkouts: WeeklyWorkouts = {
  monday: [
    {
      id: 'mon-1',
      title: 'Upper Body Strength',
      day: 'Monday',
      time: '06:00 AM',
      duration: '45 min',
      completed: true,
      description: 'Focus on chest, shoulders, and triceps with compound movements.',
      exercises: [
        { name: 'Bench Press', sets: 4, reps: '8-10', weight: '135 lbs' },
        { name: 'Overhead Press', sets: 3, reps: '10-12', weight: '85 lbs' },
        { name: 'Incline Dumbbell Press', sets: 3, reps: '10-12', weight: '50 lbs' },
        { name: 'Tricep Pushdowns', sets: 3, reps: '12-15', weight: '45 lbs' },
        { name: 'Lateral Raises', sets: 3, reps: '15-20', weight: '15 lbs' },
      ],
    },
  ],
  tuesday: [
    {
      id: 'tue-1',
      title: 'Cardio & Core',
      day: 'Tuesday',
      time: '07:30 AM',
      duration: '30 min',
      completed: false,
      description: 'HIIT training focusing on core and cardiovascular endurance.',
      exercises: [
        { name: 'Jump Rope', sets: 3, reps: '1 min' },
        { name: 'Mountain Climbers', sets: 3, reps: '45 sec' },
        { name: 'Plank', sets: 3, reps: '60 sec' },
        { name: 'Bicycle Crunches', sets: 3, reps: '20 each side' },
        { name: 'Burpees', sets: 3, reps: '10' },
      ],
    },
  ],
  wednesday: [
    {
      id: 'wed-1',
      title: 'Lower Body Strength',
      day: 'Wednesday',
      time: '06:00 PM',
      duration: '50 min',
      completed: false,
      description: 'Focus on quadriceps, hamstrings, and glutes with compound movements.',
      exercises: [
        { name: 'Squats', sets: 4, reps: '8-10', weight: '185 lbs' },
        { name: 'Romanian Deadlifts', sets: 3, reps: '10-12', weight: '135 lbs' },
        { name: 'Leg Press', sets: 3, reps: '12-15', weight: '270 lbs' },
        { name: 'Walking Lunges', sets: 3, reps: '10 each leg', weight: '20 lbs' },
        { name: 'Calf Raises', sets: 4, reps: '15-20', weight: '100 lbs' },
      ],
    },
  ],
  thursday: [
    {
      id: 'thu-1',
      title: 'Active Recovery',
      day: 'Thursday',
      time: '07:00 AM',
      duration: '30 min',
      completed: false,
      description: 'Light activity focused on mobility and recovery.',
      exercises: [
        { name: 'Foam Rolling', sets: 1, reps: '5 min' },
        { name: 'Dynamic Stretching', sets: 1, reps: '10 min' },
        { name: 'Light Cycling', sets: 1, reps: '15 min' },
      ],
    },
  ],
  friday: [
    {
      id: 'fri-1',
      title: 'Back & Biceps',
      day: 'Friday',
      time: '06:00 PM',
      duration: '45 min',
      completed: false,
      description: 'Focus on back development and arm strength.',
      exercises: [
        { name: 'Pull Ups', sets: 4, reps: '8-10' },
        { name: 'Bent Over Rows', sets: 3, reps: '10-12', weight: '115 lbs' },
        { name: 'Lat Pulldowns', sets: 3, reps: '12-15', weight: '120 lbs' },
        { name: 'Bicep Curls', sets: 3, reps: '12-15', weight: '35 lbs' },
        { name: 'Face Pulls', sets: 3, reps: '15-20', weight: '45 lbs' },
      ],
    },
  ],
  saturday: [
    {
      id: 'sat-1',
      title: 'Full Body Circuit',
      day: 'Saturday',
      time: '09:00 AM',
      duration: '60 min',
      completed: false,
      description: 'High-intensity circuit targeting all major muscle groups.',
      exercises: [
        { name: 'Kettlebell Swings', sets: 3, reps: '15', weight: '35 lbs' },
        { name: 'Push Ups', sets: 3, reps: 'Max' },
        { name: 'Dumbbell Rows', sets: 3, reps: '12 each side', weight: '40 lbs' },
        { name: 'Goblet Squats', sets: 3, reps: '15', weight: '50 lbs' },
        { name: 'Plank to Push Up', sets: 3, reps: '10' },
        { name: 'Box Jumps', sets: 3, reps: '10' },
      ],
    },
  ],
  sunday: [
    {
      id: 'sun-1',
      title: 'Rest Day',
      day: 'Sunday',
      time: 'All Day',
      duration: '0 min',
      completed: false,
      description: 'Complete rest day for recovery and muscle growth.',
      exercises: [],
    },
  ],
};

export const createMockWorkoutSession = (overrides?: Partial<WorkoutSession>): WorkoutSession => ({
  id: `workout-${Date.now()}`,
  title: 'New Workout',
  day: 'Monday',
  time: '06:00 AM',
  duration: '45 min',
  completed: false,
  description: '',
  exercises: [],
  ...overrides,
});
