import { SystemId, AssessmentAnswers } from '@/types/assessment';

export interface ExpertInsight {
  type: 'warning' | 'tip';
  message: string;
}

export function getExpertInsights(systemId: SystemId, answers: AssessmentAnswers): ExpertInsight[] {
  const insights: ExpertInsight[] = [];

  // Cost Conflict: user wants low cost but system is expensive
  if (answers.priorityCost >= 4 && (systemId === 'WF' || systemId === 'MW')) {
    insights.push({
      type: 'tip',
      message: 'This is a high-performance system; note that it carries a higher initial investment compared to EPS.',
    });
  }

  // Space Conflict: thickness priority high but not PIR
  if (answers.priorityThicknessEfficiency >= 4 && systemId !== 'PIR') {
    insights.push({
      type: 'tip',
      message: 'To further minimise wall thickness, consider Kingspan K5/PIR (approx. 40% thinner).',
    });
  }

  // Eco/Breathability Conflict: eco priority or moisture issues but EPS recommended
  if ((answers.priorityNaturalMaterials >= 4 || answers.moistureSymptoms.length > 0) && systemId === 'EPS') {
    insights.push({
      type: 'tip',
      message: 'For better breathability and eco-performance, Woodfibre or Mineral Wool is recommended.',
    });
  }

  // Acoustic Warning: high acoustics priority but PIR
  if (answers.priorityAcoustics >= 4 && systemId === 'PIR') {
    insights.push({
      type: 'warning',
      message: 'Rigid boards provide less sound insulation than Mineral Wool.',
    });
  }

  // Fire Safety Alert: tall building with combustible system
  if ((answers.buildingHeight ?? 0) > 11 && (systemId === 'EPS' || systemId === 'PIR')) {
    insights.push({
      type: 'warning',
      message: 'UK Building Regs require non-combustible systems for this height.',
    });
  }

  return insights;
}
