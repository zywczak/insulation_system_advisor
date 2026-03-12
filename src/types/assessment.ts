export type SystemId = "EPS" | "MW" | "PIR" | "WF";

export interface SystemFeatures {
  cost: number;
  thicknessEfficiency: number;
  fire: number;
  breathability: number;
  acoustics: number;
  summerComfort: number;
  robustness: number;
  eco: number;
}

export interface SystemProfile {
  id: SystemId;
  name: string;
  fullName: string;
  color: string;
  features: SystemFeatures;
  lambdaValue: number;
  typicalCostRange: [number, number];
  minThicknessPerWallType: Record<string, number>;
  minThicknessFor03U: number; // computed: max across wall types (worst-case fallback)
  fireClass: string;
  pros: string[];
  cons: string[];
  components: Record<string, string>;
  technicalNotes: string[];
}

export interface AssessmentAnswers {
  buildingType: string | null;
  buildingHeight: number | null;
  fireRequirements: string[];
  fireClass: string | null;
  grantScheme: string | null;

  hasThicknessLimit: boolean | null;
  maxThickness: number | null;
  thicknessConstraintLocations: string[];

  wallType: string | null;
  buildingAge: string | null;
  moistureSymptoms: string[];
  heritageFeatures: string[];

  priorityCost: number;
  priorityThicknessEfficiency: number;
  priorityBreathability: number;
  priorityAcoustics: number;
  prioritySummerComfort: number;


  projectType: string | null;
  prioritySpeed: number;
  workmanshipQuality: string | null;

  priorityNaturalMaterials: number;
}

export interface ExcludedSystem {
  systemId: SystemId;
  reasonCode: string;
  humanReason: string;
  triggerField: string;
  severity: "hard" | "soft";
}

export interface HardConstraintResult {
  eligible: SystemId[];
  excluded: ExcludedSystem[];
}

export interface ScoredSystem {
  systemId: SystemId;
  totalScore: number;
  baseScore: number;
  contextualAdjustment: number;
  featureScores: Record<string, number>;
  topPositiveFactors: string[];
  topNegativeFactors: string[];
}

export interface WhatIfScenario {
  change: string;
  effect: string;
  impactedSystem: SystemId;
}

export interface RecommendationTier {
  tier: "primary" | "alternative" | "aspirational" | "viable";
  system: ScoredSystem;
  reasons: string[];
  risks: string[];
  whatWouldChange?: string;
}

export interface AssessmentResult {
  eligible: SystemId[];
  excluded: ExcludedSystem[];
  ranking: ScoredSystem[];
  recommendations: RecommendationTier[];
  whatIf: WhatIfScenario[];
  rulesTriggered: string[];
  nextSteps: string[];
}

import { FormValue } from '@/components/DynamicSteps/DynamicStepRenderer';

export interface SectionProps {
  answers: AssessmentAnswers;
  onUpdate: (field: keyof AssessmentAnswers, value: FormValue) => void;
}

export const DEFAULT_ANSWERS: AssessmentAnswers = {
  buildingType: null,
  buildingHeight: null,
  fireRequirements: [],
  fireClass: null,
  grantScheme: null,
  hasThicknessLimit: null,
  maxThickness: null,
  thicknessConstraintLocations: [],
  wallType: null,
  buildingAge: null,
  moistureSymptoms: [],
  heritageFeatures: [],
  priorityCost: 0,
  priorityThicknessEfficiency: 0,
  priorityBreathability: 0,
  priorityAcoustics: 0,
  prioritySummerComfort: 0,
  projectType: null,
  prioritySpeed: 3,
  workmanshipQuality: null,
  priorityNaturalMaterials: 0,
};

export function toggleArrayValue(arr: string[], value: string): string[] {
  return arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
}
