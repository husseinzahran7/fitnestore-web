export const SPECIALTIES = [
  "Strength",
  "Calisthenics",
  "Football",
  "Yoga",
  "Nutrition",
  "Conditioning",
] as const;

// Stored values stay English (filters + DB); UI reads display labels.
export const SPEC_LABEL: Record<
  (typeof SPECIALTIES)[number],
  | "specStrength"
  | "specCalisthenics"
  | "specFootball"
  | "specYoga"
  | "specNutrition"
  | "specConditioning"
> = {
  Strength: "specStrength",
  Calisthenics: "specCalisthenics",
  Football: "specFootball",
  Yoga: "specYoga",
  Nutrition: "specNutrition",
  Conditioning: "specConditioning",
};

export interface CoachCard {
  id: string;
  name: string;
  avatarUrl: string;
  bio: string;
  specialties: string[];
  specialtiesOther: string;
  years: number;
  certifications: string[];
  freeConsult: boolean;
  hasWhatsapp: boolean;
}

export interface CoachDetail extends CoachCard {
  whatsapp: string;
}

export type ConsultState = { error?: string };
