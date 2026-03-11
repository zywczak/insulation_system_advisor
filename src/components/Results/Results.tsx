import { Box } from '@mui/material';
import { CalculationResults, CalculatorData } from '@/lib/calculator/types';
import { ResultsActions } from './ResultsActions';
import TechnicalDisclaimer from './Technicaldisclaimer';
import QuoteForm from './Quoteform';
import RequiredNextSteps from './Requirednextsteps';
import RecommendationCard from './Recommendationcard';

// ─── Types ───────────────────────────────────────────────────────────────────

interface Step5ResultsProps {
  readonly results: CalculationResults | null;
  readonly data: CalculatorData;
  readonly onGetQuote: () => void;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function Step5Results({ results, data, onGetQuote }: Step5ResultsProps) {

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>

      <RecommendationCard
              productBrand="EWI Pro ROCKWOOL"
              productName="Dual Density System"
              score={49}
              keyStrengths={[
                'Acoustic performance',
                'Breathability & moisture management',
                'Environmental credentials',
                'Good match for moisture-risk building',
                'Compatible with heritage construction',
              ]}
              considerations={[
                'Heavier than EPS — may need enhanced fixings',
                'Thicker for equivalent U-value vs PIR',
              ]}
              additionalInfo="Kingspan K5 (C-s2,d0) does not meet the required A1 only fire classification."
              expertInsight="UK Building Regs require non-combustible systems for this height."
              costRange="£140–170/m²"
              fireClass="A1 (Non-combustible)"
              lambda="0.036 W/mK"
              minThickness="100mm"
            />
      
            <RecommendationCard
              productBrand="EWI Pro Kingspan"
              productName="Kooltherm K5 System"
              score={2}
              keyStrengths={['Thickness efficiency']}
              considerations={[
                'Kingspan K5 (C-s2,d0) does not meet the required A1 only fire classification.',
              ]}
              additionalInfo="Kingspan K5 (C-s2,d0) does not meet the required A1 only fire classification."
              expertInsight="UK Building Regs require non-combustible systems for this height."
              costRange="£140–170/m²"
              fireClass="A1 (Non-combustible)"
              lambda="0.036 W/mK"
              minThickness="100mm"
            />
      
            {/* ── Required Next Steps ── */}
            <RequiredNextSteps />
      
            {/* ── Quote Form ── */}
            <QuoteForm
              onSubmit={(data) => console.log('Quote submitted:', data)}
              onDownload={() => console.log('Download')}
              onRestart={() => console.log('Restart')}
            />
      
            {/* ── Technical Disclaimer ── */}
            <TechnicalDisclaimer />
            
      {results && <ResultsActions data={data} results={results} onGetQuote={onGetQuote} />}
      
      {results && (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <p>Results calculated successfully! Component placeholders coming soon.</p>
        </Box>
      )}
    </Box>
  );
}