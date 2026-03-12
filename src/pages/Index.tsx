import AdvisorWizard from '@/components/AdvisorWizard';
import InsulationAssessment from '@/components/StartView/Insulationassessment';
import { useSearchParams } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { Box } from '@mui/material';

const Index = () => {
  const [searchParams] = useSearchParams();
  const isEmbed = searchParams.get('embed') === 'true';
  const containerRef = useRef<HTMLDivElement>(null);
  const [showStartView, setShowStartView] = useState(true);

  useEffect(() => {
    if (!isEmbed) return;

    const reportHeight = () => {
      if (containerRef.current) {
        const height = containerRef.current.scrollHeight;
        window.parent.postMessage(
          { type: 'ewi-calculator-resize', height },
          '*'
        );
      }
    };

    // Report height on load and on any resize/mutation
    reportHeight();
    const interval = setInterval(reportHeight, 300);

    const observer = new MutationObserver(reportHeight);
    if (containerRef.current) {
      observer.observe(containerRef.current, {
        childList: true,
        subtree: true,
        attributes: true,
      });
    }

    window.addEventListener('resize', reportHeight);

    return () => {
      clearInterval(interval);
      observer.disconnect();
      window.removeEventListener('resize', reportHeight);
    };
  }, [isEmbed]);

  return (
    <Box
      ref={containerRef}
      sx={isEmbed ? { bgcolor: 'transparent' } : { minHeight: '100vh', bgcolor: 'background.default', pb: 4 }}
    >
      {showStartView ? (
        <InsulationAssessment onStartAssessment={() => setShowStartView(false)} />
      ) : (
        <Box sx={{ maxWidth: 'lg', mx: 'auto', px: isEmbed ? 0 : 2 }}>
          <AdvisorWizard />
        </Box>
      )}
    </Box>
  );
};

export default Index;
