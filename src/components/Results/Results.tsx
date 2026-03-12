import { Box } from '@mui/material';
import { AssessmentResult, AssessmentAnswers, SystemProfile } from '@/types/assessment';
import { SYSTEMS } from '@/data/systems';
import { getExpertInsights } from '@/engine/expertInsights';
import TechnicalDisclaimer from './Technicaldisclaimer';
import QuoteForm from './Quoteform';
import RequiredNextSteps from './Requirednextsteps';
import RecommendationCard from './Recommendationcard';

// ─── Types ───────────────────────────────────────────────────────────────────

interface Step5ResultsProps {
  readonly results: AssessmentResult | null;
  readonly data: AssessmentAnswers;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function mapWallType(wallType: string | null): string {
  switch (wallType) {
    case 'Solid Brick Walls':      return 'solidBrick';
    case 'Solid Stone Walls':      return 'solidStone';
    case 'Concrete Blocks':        return 'concreteBlocks';
    case 'Cavity Walls - Unfilled':return 'cavityUnfilled';
    case 'Timber Frame':           return 'timberFrame';
    default:                       return 'solidStone';
  }
}

function getMinThickness(sys: SystemProfile, answers: AssessmentAnswers): string {
  const key = mapWallType(answers.wallType);
  const mm = sys.minThicknessPerWallType[key] ?? sys.minThicknessFor03U;
  return `${mm}mm`;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function Step5Results({ results, data }: Step5ResultsProps) {
  if (!results) return null;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>

      {/* ── Recommendation Cards ── */}
      {results.recommendations.map((rec) => {
        const sys = SYSTEMS[rec.system.systemId];
        console.log(sys);
        const insights = getExpertInsights(rec.system.systemId, data);
        const expertInsight = insights.length > 0 ? insights[0].message : undefined;

        return (
          <RecommendationCard
            key={rec.tier}
            tier={rec.tier}
            productName={sys.fullName}
            score={rec.system.totalScore}
            keyStrengths={rec.reasons}
            considerations={rec.risks}
            technicalNotes={sys.technicalNotes}
            expertInsight={expertInsight}
            costRange={`£${sys.typicalCostRange[0]}–${sys.typicalCostRange[1]}/m²`}
            fireClass={sys.fireClass}
            lambda={`${sys.lambdaValue} W/mK`}
            minThickness={getMinThickness(sys, data)}
            whatWouldChange={rec.whatWouldChange}
          />
        );
      })}

      {/* ── Required Next Steps ── */}
      <RequiredNextSteps steps={results.nextSteps} />

      {/* ── Quote Form ── */}
      <QuoteForm
        results={results}
        answers={data}
      />

      {/* ── Technical Disclaimer ── */}
      <TechnicalDisclaimer />

    </Box>
  );
}