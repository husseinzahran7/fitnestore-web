export interface WeightPoint {
  date: string;
  weight: number;
}

export interface StrengthPoint {
  date: string;
  squat: number;
  bench: number;
  deadlift: number;
}

export interface MeasurementPoint {
  date: string;
  chest: number;
  waist: number;
  arms: number;
}

export interface ProgressPhoto {
  week: string;
  front: string;
  side: string;
}

export const userWeightProgress: WeightPoint[] = [
  { date: "Week 1", weight: 185 },
  { date: "Week 2", weight: 183 },
  { date: "Week 3", weight: 181 },
  { date: "Week 4", weight: 179 },
  { date: "Week 5", weight: 178 },
  { date: "Week 6", weight: 176 },
  { date: "Week 7", weight: 174 },
  { date: "Week 8", weight: 173 },
];

export const userStrengthProgress: StrengthPoint[] = [
  { date: "Week 1", squat: 200, bench: 160, deadlift: 240 },
  { date: "Week 2", squat: 205, bench: 165, deadlift: 245 },
  { date: "Week 3", squat: 215, bench: 170, deadlift: 255 },
  { date: "Week 4", squat: 215, bench: 175, deadlift: 260 },
  { date: "Week 5", squat: 225, bench: 175, deadlift: 275 },
  { date: "Week 6", squat: 230, bench: 180, deadlift: 280 },
  { date: "Week 7", squat: 235, bench: 185, deadlift: 285 },
  { date: "Week 8", squat: 240, bench: 190, deadlift: 295 },
];

export const userBodyMeasurements: MeasurementPoint[] = [
  { date: "Week 1", chest: 42, waist: 36, arms: 15 },
  { date: "Week 2", chest: 42, waist: 35.5, arms: 15.2 },
  { date: "Week 3", chest: 42.5, waist: 35, arms: 15.3 },
  { date: "Week 4", chest: 42.5, waist: 34.5, arms: 15.5 },
  { date: "Week 5", chest: 43, waist: 34, arms: 15.6 },
  { date: "Week 6", chest: 43, waist: 33.5, arms: 15.7 },
  { date: "Week 7", chest: 43.5, waist: 33, arms: 15.8 },
  { date: "Week 8", chest: 43.5, waist: 32.5, arms: 16 },
];

export const userProgressPhotos: ProgressPhoto[] = [
  { week: "Week 1", front: "https://placehold.co/200x300?text=Week+1", side: "https://placehold.co/200x300?text=Week+1" },
  { week: "Week 4", front: "https://placehold.co/200x300?text=Week+4", side: "https://placehold.co/200x300?text=Week+4" },
  { week: "Week 8", front: "https://placehold.co/200x300?text=Week+8", side: "https://placehold.co/200x300?text=Week+8" },
];
