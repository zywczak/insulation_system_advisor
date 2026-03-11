import { useCalculator } from '@/hooks/useCalculator';
import { StepProgress } from './StepProgress';
import { Step5Results } from './Results/Results';
import { DynamicStepRenderer } from './DynamicSteps/DynamicStepRenderer';
import ArrowCircleRightOutlinedIcon from "@mui/icons-material/ArrowCircleRightOutlined";
import ArrowCircleLeftOutlinedIcon from "@mui/icons-material/ArrowCircleLeftOutlined";
import Header from './header';
import { Card, CardContent, Box } from '@mui/material';
import CalculatorIntro from './CalculatorIntro';
import StepButton from './stepbutton';

export function EWICalculator() {
  const {
    currentStep,
    data,
    results,
    totalSteps,
    updateFormData,
    canProceed,
    nextStep,
    prevStep,
    goToStep,
    openContactModal,
  } = useCalculator();

  const renderStep = () => {
    // All steps except the last one (results) are dynamic
    if (currentStep <= totalSteps) {
      return (
        <DynamicStepRenderer
          stepIndex={currentStep - 1}
          formData={data as unknown as Record<string, string | number>}
          onChange={updateFormData}
        />
      );
    }
    
    // Last step is Results
    if (currentStep > totalSteps) {
      return (
        <Step5Results
          results={results}
          data={data}
          onGetQuote={openContactModal}
        />
      );
    }
    
    return null;
  };

  return (
    <Box sx={{ maxWidth: "1238px", mx: "auto"}}>

      <CalculatorIntro />

      <Card sx={{
        borderRadius: "24px",
        backgroundColor: "#FFFFFF",
        p: 0,
      }}>
        <CardContent sx={{ p: 0, pb: 0, '&&:last-child': { pb: 0 } }}>

          <Header />

          {currentStep <= totalSteps && (
            <StepProgress
              currentStep={currentStep}
              canProceed={canProceed}
              onStepClick={goToStep}
              totalSteps={totalSteps}
            />
          )}

          <Box key={currentStep}
            sx={{
              mx: { xs: "16px", sm: "48px", md: "86px" },
            }}>
            {renderStep()}
          </Box>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              mx: { xs: "16px", sm: "48px", md: "86px" },
              gap: "18px",
              mt: "36px",
              mb: { xs: "24px", sm: "48px" },
            }}
          >
            {currentStep !== 1 && (
            <StepButton
              label="Back"
              onClick={prevStep}
              disabled={currentStep === 1}
              icon={<ArrowCircleLeftOutlinedIcon sx={{ fontSize: 20 }} />}
              iconPosition="start"
            />
            )}

            <Box
              sx={{
                flex: 1,
                height: "1px",
                backgroundColor: "#E4E4E4",
              }}
            />
            {currentStep <= totalSteps && (
            <StepButton
              label={currentStep === totalSteps ? "Calculate" : "Next"}
              onClick={nextStep}
              disabled={!canProceed(currentStep)}
              icon={<ArrowCircleRightOutlinedIcon sx={{ fontSize: 20 }} />}
              iconPosition="end"
            />
            )}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
