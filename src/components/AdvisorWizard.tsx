import { useState, useEffect } from 'react';
import { AssessmentAnswers, AssessmentResult, DEFAULT_ANSWERS } from '@/types/assessment';
import { composeResults } from '@/engine/resultComposer';
import { StepProgress } from './StepProgress';
import { Step5Results } from './Results/Results';
import { DynamicStepRenderer, FormValue } from './DynamicSteps/DynamicStepRenderer';
import ArrowCircleRightOutlinedIcon from '@mui/icons-material/ArrowCircleRightOutlined';
import ArrowCircleLeftOutlinedIcon from '@mui/icons-material/ArrowCircleLeftOutlined';
import Header from './header';
import { Card, CardContent, Box } from '@mui/material';
import CalculatorIntro from './AdvisorIntro';
import StepButton from './stepbutton';
import { steps } from '@/data/steps/stepdata';

// ─── Component ────────────────────────────────────────────────────────────────

export function AdvisorWizard() {
  const totalSteps = steps.length;

  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState<AssessmentAnswers>(DEFAULT_ANSWERS);
  const [results, setResults] = useState<AssessmentResult | null>(null);

  const isResultsStep = currentStep > totalSteps;

  // Przeliczaj wyniki zawsze gdy wchodzisz do Results (aby uwzględnić zmiany po cofnięciu)
  useEffect(() => {
    if (isResultsStep) {
      const result = composeResults(answers);
      setResults(result);
    }
  }, [isResultsStep, answers]);

  // ── Aktualizacja pola formularza ───────────────────────────────────────────
  const updateAnswer = (name: string, value: FormValue) => {
    setAnswers((prev) => ({ ...prev, [name]: value }));
  };

  // ── Walidacja bieżącego kroku ──────────────────────────────────────────────
  const canProceed = (step: number): boolean => {
    const stepData = steps[step - 1]; // step 1 = index 0
    if (!stepData) return true;

    // Sprawdź czy wszystkie wymagane pola są wypełnione
    for (const input of stepData.inputs) {
      // Sprawdź parent condition - jeśli pole nie jest widoczne, pomijamy je
      if (input.parentCondition) {
        const parentValue = answers[input.parentCondition.name as keyof AssessmentAnswers];
        let isVisible = false;

        if (input.parentCondition.operator === 'includesAny') {
          // Check if parentValue includes any of the values in the array
          const conditionValues = input.parentCondition.value as string[];
          if (Array.isArray(parentValue)) {
            isVisible = parentValue.some(val => conditionValues.includes(String(val)));
          } else {
            isVisible = conditionValues.includes(String(parentValue));
          }
        } else {
          // Simple equality check
          const conditionValue = input.parentCondition.value as string;
          isVisible =
            parentValue === conditionValue ||
            (conditionValue === 'yes' && parentValue === true) ||
            (conditionValue === 'no' && parentValue === false);
        }
        
        if (!isVisible) continue; // Pole nie jest widoczne, pomijamy
      }

      // Jeśli pole jest wymagane, sprawdź czy ma wartość
      const hasRequired = 'required' in input && input.required;
      if (hasRequired) {
        const value = answers[input.name as keyof AssessmentAnswers];
        
        if (input.type === 'radio' && 'multiSelect' in input && input.multiSelect) {
          // Multi-select radio - sprawdź czy array ma elementy
          if (!Array.isArray(value) || value.length === 0) {
            return false;
          }
        } else if (input.type === 'radio') {
          // Single radio - sprawdź czy string nie jest pusty
          if (!value || value === '') {
            return false;
          }
        } else if (input.type === 'number') {
          // Number - sprawdź czy jest liczbą
          if (value === null || value === undefined || value === '') {
            return false;
          }
        }
        // Slider zawsze ma wartość domyślną, więc nie wymaga sprawdzania
      }
    }

    return true;
  };

  // ── Nawigacja ──────────────────────────────────────────────────────────────
  const nextStep = () => {
    if (!canProceed(currentStep)) return;
    setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

  const goToStep = (step: number) => {
    if (step >= 1 && step <= currentStep) setCurrentStep(step);
  };

  // ── Główny widok (kroki formularza lub wyniki) ────────────────────────────
  return (
    <Box sx={{ maxWidth: '1238px', mx: 'auto' }}>

      <CalculatorIntro />

      <Card sx={{ borderRadius: '24px', backgroundColor: '#FFFFFF', p: 0 }}>
        <CardContent sx={{ p: 0, pb: 0, '&&:last-child': { pb: 0 } }}>

          <Header />

          {/* Progress — tylko podczas kroków formularza */}
          {!isResultsStep && (
            <StepProgress
              currentStep={currentStep}
              onStepClick={goToStep}
              totalSteps={totalSteps}
              canProceedCurrent={canProceed(currentStep)}
            />
          )}

          {/* Zawartość kroku */}
          <Box
            key={currentStep}
            sx={{ mx: { xs: '16px', sm: '48px', md: '86px' } }}
          >
            {isResultsStep ? (
              <Step5Results
                results={results}
                data={answers}
              />
            ) : (
              <DynamicStepRenderer
                stepIndex={currentStep - 1}
                formData={answers as unknown as Record<string, FormValue>}
                onChange={updateAnswer}
              />
            )}
          </Box>

          {/* Nawigacja */}
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

export default AdvisorWizard;
