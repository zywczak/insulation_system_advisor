import { useState } from 'react';
import { Box, Button, CircularProgress } from '@mui/material';
import { Download as DownloadIcon } from '@mui/icons-material';
import { CalculationResults, CalculatorData } from '@/lib/calculator/types';
import { generateEWIReport } from '@/lib/pdf/generateReport';

interface ResultsActionsProps {
  readonly data: CalculatorData;
  readonly results: CalculationResults;
  readonly onGetQuote: () => void;
}

const btnBase = {
  height: { xs: '38px', sm: '44px' },
  borderRadius: '45px',
  textTransform: 'none',
  fontSize: { xs: '12px', sm: '14px' },
  fontWeight: 700,
} as const;

export function ResultsActions({ data, results, onGetQuote }: ResultsActionsProps) {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);
    try {
      await generateEWIReport(data, results);
    } catch (error) {
      console.error('Failed to generate PDF:', error);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'center', gap: 1.5, mt: '24px' }}>
      <Button
        onClick={handleDownloadPdf}
        disabled={isGeneratingPdf}
        startIcon={isGeneratingPdf ? <CircularProgress size={16} /> : <DownloadIcon />}
        sx={{ ...btnBase, border: '1px solid #48D858', width: '250px', color: '#48D858', '&.Mui-disabled': { backgroundColor: '#D7D7D7', color: '#48D858', opacity: 0.7 } }}
      >
        {isGeneratingPdf ? 'Generating...' : 'Download PDF Report'}
      </Button>

      <Button
        onClick={onGetQuote}
        sx={{ ...btnBase, backgroundColor: '#48D858', width: '200px', color: '#fff', '&.Mui-disabled': { backgroundColor: '#D7D7D7', color: '#fff', opacity: 0.7 } }}
      >
        Find a local installer
      </Button>
    </Box>
  );
}