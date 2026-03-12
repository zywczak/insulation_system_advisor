import { AssessmentAnswers, AssessmentResult, RecommendationTier, WhatIfScenario, SystemId } from '@/types/assessment';
import { SYSTEMS } from '@/data/systems';

function mapWallType(wallType: string | null): string {
  switch (wallType) {
    case 'Solid Brick Walls': return 'solidBrick';
    case 'Solid Stone Walls': return 'solidStone';
    case 'Concrete Blocks': return 'concreteBlocks';
    case 'Cavity Walls - Unfilled': return 'cavityUnfilled';
    case 'Timber Frame': return 'timberFrame';
    default: return 'solidStone';
  }
}
import { evaluateHardConstraints } from './hardConstraints';
import { computeScores } from './scoring';

function generateWhatIf(
  answers: AssessmentAnswers,
  excluded: { systemId: SystemId; reasonCode: string }[],
  ranking: { systemId: SystemId; totalScore: number }[]
): WhatIfScenario[] {
  const scenarios: WhatIfScenario[] = [];

  const isHighRise = (answers.buildingHeight ?? 0) > 11;

  for (const ex of excluded) {
    // Never suggest opting out of building regulations for high-rise
    if (ex.reasonCode.startsWith('FIRE') && !isHighRise) {
      scenarios.push({
        change: 'If fire classification were not required',
        effect: `${SYSTEMS[ex.systemId].name} would become eligible`,
        impactedSystem: ex.systemId,
      });
    }
    if (ex.reasonCode === 'THICKNESS_LIMIT') {
      const wallTypeKey = mapWallType(answers.wallType);
      const minT = SYSTEMS[ex.systemId].minThicknessPerWallType[wallTypeKey] ?? SYSTEMS[ex.systemId].minThicknessFor03U;
      scenarios.push({
        change: `If thickness limit were increased to ${minT}mm`,
        effect: `${SYSTEMS[ex.systemId].name} would become a viable option`,
        impactedSystem: ex.systemId,
      });
    }
  }

  if (answers.priorityCost >= 4) {
    const premium = ranking.find((r) => ['WF', 'PIR'].includes(r.systemId));
    if (premium) {
      scenarios.push({
        change: 'If budget were less constrained',
        effect: `${SYSTEMS[premium.systemId].name} could deliver better long-term performance`,
        impactedSystem: premium.systemId,
      });
    }
  }

  if (answers.priorityBreathability <= 2 && ranking.some((r) => r.systemId === 'WF')) {
    scenarios.push({
      change: 'If breathability priority were increased to 4–5',
      effect: 'Woodfibre would likely rank higher',
      impactedSystem: 'WF',
    });
  }

  return scenarios.slice(0, 4);
}

export function composeResults(answers: AssessmentAnswers): AssessmentResult {
  const { eligible, excluded } = evaluateHardConstraints(answers);
  const ranking = computeScores(eligible, answers);
  const whatIf = generateWhatIf(answers, excluded, ranking);

  const recommendations: RecommendationTier[] = [];
  const rulesTriggered = excluded.map((e) => `${e.reasonCode}: ${e.humanReason}`);

  if (ranking.length >= 1) {
    recommendations.push({
      tier: 'primary',
      system: ranking[0],
      reasons: ranking[0].topPositiveFactors,
      risks: SYSTEMS[ranking[0].systemId].cons.slice(0, 2),
    });
  }

  if (ranking.length >= 2) {
    const diff = ranking[0].totalScore - ranking[1].totalScore;
    recommendations.push({
      tier: 'alternative',
      system: ranking[1],
      reasons: ranking[1].topPositiveFactors,
      risks: SYSTEMS[ranking[1].systemId].cons.slice(0, 2),
      whatWouldChange:
        diff < 5
          ? 'Very close to the primary — small priority changes could make this #1'
          : `Would need ${diff > 15 ? 'significant' : 'moderate'} priority adjustments to become the top choice`,
    });
  }

  // Aspirational from excluded premium options or 3rd ranked
  const aspirationalExcluded = excluded.filter(
    (e) => ['WF', 'PIR'].includes(e.systemId) && e.reasonCode !== 'FIRE_HEIGHT_REG'
  );
  if (aspirationalExcluded.length > 0) {
    const aspId = aspirationalExcluded[0].systemId;
    const hypothetical = computeScores([aspId], answers);
    if (hypothetical.length > 0) {
      recommendations.push({
        tier: 'aspirational',
        system: hypothetical[0],
        reasons: hypothetical[0].topPositiveFactors,
        risks: [aspirationalExcluded[0].humanReason],
        whatWouldChange: aspirationalExcluded[0].humanReason,
      });
    }
  } else if (ranking.length >= 3) {
    recommendations.push({
      tier: 'aspirational',
      system: ranking[2],
      reasons: ranking[2].topPositiveFactors,
      risks: SYSTEMS[ranking[2].systemId].cons.slice(0, 2),
      whatWouldChange: 'Consider if budget or constraints change in the future',
    });
  }

  // Add remaining eligible systems as "viable" tier
  const usedIds = new Set(recommendations.map((r) => r.system.systemId));
  for (const scored of ranking) {
    if (!usedIds.has(scored.systemId)) {
      recommendations.push({
        tier: 'viable',
        system: scored,
        reasons: scored.topPositiveFactors,
        risks: SYSTEMS[scored.systemId].cons.slice(0, 2),
        whatWouldChange: 'Eligible but ranked lower given your current priorities',
      });
    }
  }

  return {
    eligible,
    excluded,
    ranking,
    recommendations,
    whatIf,
    rulesTriggered,
    nextSteps: [
      'Confirm target U-value with your architect or energy assessor',
      'Commission a site survey to assess substrate condition and fixings',
      'Obtain detailed specifications for window reveals and junction details',
      'Request system-specific BBA or ETA certification documents',
      'Get installation quotes from approved system installers',
      'Review building control requirements for your specific project',
    ],
  };
}
