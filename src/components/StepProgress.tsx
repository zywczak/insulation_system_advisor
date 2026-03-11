import React, { useRef, useState, useEffect } from 'react';
import { Box, Typography, ButtonBase } from '@mui/material';
import { steps } from '@/data/stepdata';

interface StepProgressProps {
  readonly currentStep: number;
  readonly totalSteps: number;
  readonly canProceed: (step: number) => boolean;
  readonly onStepClick: (step: number) => void;
}

export function StepProgress({
  currentStep,
  totalSteps,
  canProceed,
  onStepClick,
}: StepProgressProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showLabels, setShowLabels] = useState(true);
  const [showBar, setShowBar] = useState(true);

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width;
        setShowLabels(width >= 800);
        setShowBar(width >= 600);
      }
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const total = totalSteps;

  // Build step labels: all dynamic steps + results
  const dynamicStepLabels = steps.map(s => s.name);
  const allStepLabels = [...dynamicStepLabels, 'Results'];

  const completedSteps =
  currentStep - (canProceed(currentStep) ? 0 : 1);

  const percentComplete = Math.round(
    ((Math.min(completedSteps, total) ) /
      Math.max(total, 1)) *
      100,
  );

  const stepItems = Array.from({ length: total }).map((_, i) => ({
    label: allStepLabels[i] ?? `Step ${i + 1}`,
    index: i,
  }));

  const isAccessible = (stepNumber: number) => {
    return (
      stepNumber <= currentStep ||
      (stepNumber === currentStep + 1 && canProceed(currentStep))
    );
  };

  return (
    <Box
      ref={containerRef}
      sx={{
        mb: "24px", 
        mx: "48px",
        backgroundColor: '#F8F8F8',
        borderBottomLeftRadius: "20px",
        borderBottomRightRadius: "20px",
        py: "24px",
        px: "48px",
        "@media (max-width: 1165px)": {
          mx: "32px",
          px: "32px",
        },
        "@media (max-width: 1120px)": {
          mx: "16px",
          px: "16px",
        },
        "@media (max-width: 1056px)": {
          mx: "0px",
          px: "16px",
          borderRadius: "0px",
        },
      }}>
      <Box
        display="flex"
        justifyContent="space-between"
        sx={{
          mb: showBar ? "10px" : "0px",
        }}
      >
        <Typography
          sx={{
            fontWeight: 500,
            fontSize: { xs: "12px", sm: "14px" },
            letterSpacing: "0px",
            color: "#1C1C1C",
          }}
        >
          <Box component="span" sx={{ fontWeight: 700 }}>
            Step {currentStep}
          </Box>{" "}
          of {total}
        </Typography>

        <Typography
          sx={{
            fontWeight: 500,
            fontSize: { xs: "12px", sm: "14px" },
            letterSpacing: "0px",
            color: "#1C1C1C",
          }}
        >
          {percentComplete}% complete
        </Typography>
      </Box>

      {showBar && (
        <Box display="flex" flexDirection="column" gap={1.5}>
          <Box display="flex" alignItems="center">
            {stepItems.map((s) => {
              const stepNumber = s.index + 1;
              const filled = stepNumber <= currentStep;
              const accessible = isAccessible(stepNumber);

              return (
                <ButtonBase
                  key={s.index}
                  onClick={() =>
                    accessible && onStepClick(stepNumber)
                  }
                  disabled={!accessible}
                  sx={{
                    flex: 1,
                    height: 12,
                    bgcolor: filled
                      ? '#48D858'
                      : '#DDDDDD',
                    cursor: accessible
                      ? 'pointer'
                      : 'default',
                    transition: 'background-color 0.2s',
                    
                    borderRadius: "5px",
                  }}
                  title={s.label}
                />
              );
            })}
          </Box>

          {showLabels && (
            <Box display="flex" alignItems="center">
              {stepItems.map((s) => {
                const stepNumber = s.index + 1;
                const filled = stepNumber <= currentStep;

                return (
                  <Typography
                    key={s.index}
                    align="center"
                    sx={{
                      fontSize: { xs: "12px", sm: "14px" },
                      flex: 1,
                      color: filled ? "#1D1D1D" : "#8B959A",
                      fontWeight: 600,
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {s.label}
                  </Typography>
                );
              })}
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
}