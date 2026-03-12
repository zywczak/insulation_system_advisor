import { AssessmentAnswers, ScoredSystem, SystemId } from '@/types/assessment';
import { SYSTEMS } from '@/data/systems';
import config from '@/data/systemsConfig.json';

const FEATURE_KEYS = [
  'cost', 'thicknessEfficiency', 'breathability',
  'acoustics', 'summerComfort', 'eco',
] as const;

type FeatureKey = typeof FEATURE_KEYS[number];

const PRIORITY_MAP: Record<string, FeatureKey> = {
  priorityCost: 'cost',
  priorityThicknessEfficiency: 'thicknessEfficiency',
  priorityBreathability: 'breathability',
  priorityAcoustics: 'acoustics',
  prioritySummerComfort: 'summerComfort',
  priorityNaturalMaterials: 'eco',
};

const contextualAdjustments = config.contextualAdjustments as Record<string, Record<SystemId, number>>;

function getUserWeights(answers: AssessmentAnswers): Record<FeatureKey, number> {
  const raw = {} as Record<FeatureKey, number>;
  for (const [answerKey, featureKey] of Object.entries(PRIORITY_MAP)) {
    raw[featureKey] = (answers)[answerKey] / 5;
  }

  // Cost amplification: when user prioritizes cost highly, double its weight
  if (answers.priorityCost >= 4) {
    raw['cost'] *= 2;
  }

  const total = Object.values(raw).reduce((s, v) => s + v, 0);
  if (total === 0) {
    FEATURE_KEYS.forEach((k) => (raw[k] = 1 / FEATURE_KEYS.length));
  } else {
    for (const k of FEATURE_KEYS) raw[k] = (raw[k] || 0) / total;
  }
  return raw;
}

function getContextualAdjustment(id: SystemId, a: AssessmentAnswers): number {
  let adj = 0;

  const hasMoisture = a.moistureSymptoms.length > 0 && !a.moistureSymptoms.includes('None');
  const hasHeritage = a.heritageFeatures.length > 0 && !a.heritageFeatures.includes('None');

  if (hasMoisture) adj += contextualAdjustments.moisture[id];
  if (hasHeritage) adj += contextualAdjustments.heritage[id];
  if (a.wallType === 'Solid wall masonry') adj += contextualAdjustments.solid[id];
  if (a.workmanshipQuality === 'Standard market level') adj += contextualAdjustments.stdWork[id];
  if (a.prioritySpeed >= 4) adj += contextualAdjustments.speed[id];
  if (a.priorityCost >= 4) adj += contextualAdjustments.lowBudget[id];
  if (a.buildingAge && ['Pre 1920', '1920–1970'].includes(a.buildingAge)) adj += contextualAdjustments.oldBuild[id];
  if (['Detached house', 'Semi-detached house'].includes(a.buildingType || '') && a.fireRequirements.length === 0 && !hasMoisture) adj += contextualAdjustments.residential[id];
  if (a.buildingAge === 'Pre 1920' && a.wallType === 'Solid wall masonry') adj += contextualAdjustments.preSolidCombo[id];
  if (a.hasThicknessLimit) adj += contextualAdjustments.thicknessBonus[id];

  // Industry Preference: residential low-rise buildings below 11m
  const residentialTypes = ['Detached house', 'Semi-detached house', 'Terraced house', 'Low rise flats (below 11m)'];
  const isResidential = residentialTypes.includes(a.buildingType || '');
  const isLowRise = !a.buildingHeight || a.buildingHeight < 11;
  if (isResidential && isLowRise) {
    // EPS "Market Leader for Value": only if cost is top priority (>= 4)
    if (id === 'EPS' && a.priorityCost >= 4) {
      adj += contextualAdjustments.residentialLowRise[id];
    }
    // PIR "Premium Standard for Space Optimization": only if thickness is a priority or thickness limit is active
    if (id === 'PIR' && (a.priorityThicknessEfficiency >= 4 || a.hasThicknessLimit)) {
      adj += contextualAdjustments.residentialLowRise[id];
    }
  }

  // MW/WF suppression: penalize unless user explicitly prioritizes their strengths (>80%)
  const wantsMWStrengths = a.priorityAcoustics > 4;
  const wantsWFStrengths = a.priorityNaturalMaterials > 4 || a.priorityAcoustics > 4;
  if (!wantsMWStrengths && (id === 'MW')) adj += contextualAdjustments.residentialSuppression[id];
  if (!wantsWFStrengths && (id === 'WF')) adj += contextualAdjustments.residentialSuppression[id];

  return adj;
}

const SCORING_FEATURE_LABELS: Record<string, string> = {
  cost: 'Low investment cost',
  thicknessEfficiency: 'Thickness efficiency',
  breathability: 'Breathability & moisture management',
  acoustics: 'Acoustic performance',
  summerComfort: 'Summer comfort',
  eco: 'Environmental credentials',
};

export function computeScores(eligibleSystems: SystemId[], answers: AssessmentAnswers): ScoredSystem[] {
  const weights = getUserWeights(answers);

  const result = eligibleSystems
    .map((id) => {
      const sys = SYSTEMS[id];
      let baseScore = 0;
      const featureScores: Record<string, number> = {};

      for (const k of FEATURE_KEYS) {
        const contribution = weights[k] * sys.features[k] * 100;
        featureScores[k] = Math.round(contribution);
        baseScore += contribution;
      }

      const contextualAdjustment = getContextualAdjustment(id, answers);
      const totalScore = Math.max(0, Math.min(100, Math.round(baseScore + contextualAdjustment)));

      const scored = FEATURE_KEYS
        .map((k) => ({ key: k, label: SCORING_FEATURE_LABELS[k], raw: sys.features[k], contrib: weights[k] * sys.features[k] }))
        .sort((a, b) => b.contrib - a.contrib);

      const positive = scored.filter((s) => s.raw >= 0.6).slice(0, 3).map((s) => s.label);
      const negative = scored.filter((s) => s.raw <= 0.4).slice(0, 2).map((s) => `Lower ${s.label.toLowerCase()}`);

      if (answers.moistureSymptoms.length > 0 && sys.features.breathability >= 0.7) {
        positive.push('Good match for moisture-risk building');
      }
      if (answers.heritageFeatures.length > 0 && sys.features.breathability >= 0.7) {
        positive.push('Compatible with heritage construction');
      }

      return {
        systemId: id,
        totalScore,
        baseScore: Math.round(baseScore),
        contextualAdjustment,
        featureScores,
        topPositiveFactors: positive,
        topNegativeFactors: negative,
      };
    })
    .sort((a, b) => b.totalScore - a.totalScore);

  // Tie-breaker: if top two systems differ by ≤1 point, award +1 to the more "innovative" (higher environmental score)
  if (result.length >= 2 && result[0].totalScore - result[1].totalScore <= 1) {
    const env0 = SYSTEMS[result[0].systemId].features.eco;
    const env1 = SYSTEMS[result[1].systemId].features.eco;
    if (env1 > env0) {
      result[1].totalScore = Math.min(100, result[1].totalScore + 1);
      result.sort((a, b) => b.totalScore - a.totalScore);
    } else if (env0 >= env1) {
      result[0].totalScore = Math.min(100, result[0].totalScore + 1);
    }
  }

  return result;
}
