export const SPECIALTIES = [
  "Strength",
  "Calisthenics",
  "Football",
  "Yoga",
  "Nutrition",
  "Conditioning",
] as const;

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
