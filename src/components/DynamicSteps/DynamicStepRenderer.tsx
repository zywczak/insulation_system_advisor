import { Box } from '@mui/material';
import IconTextBlock from '../icontextbloick';
import { NumberInput } from './Numberinput';
import { RadioInput } from './Radioinput';
import { SliderInput } from './Sliderinput';
import Description from './Description';
import { steps } from '@/data/stepdata';

// ─── Types ───────────────────────────────────────────────────────────────────

interface DynamicStepRendererProps {
  readonly stepIndex: number;
  readonly formData: Record<string, string | number>;
  readonly onChange: (name: string, value: string | number) => void;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function DynamicStepRenderer({ stepIndex, formData, onChange }: DynamicStepRendererProps) {
  const step = steps[stepIndex];

  if (!step) {
    return null;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <IconTextBlock 
        title={step.name} 
        subtitle={step.description} 
        icon={step.icon} 
      />

      {step.helpText && (
        <Box sx={{ mt: '16px' }}>
          <Description />
        </Box>
      )}

      <Box >


        {step.inputs.map((input, idx) => {
          const key = `${input.name}-${idx}`;

          // Check parent condition
          if (input.parentCondition) {
            const parentValue = formData[input.parentCondition.name];
            if (parentValue !== input.parentCondition.value) {
              return null;
            }
          }

          switch (input.type) {
            case 'radio':
              return (
                <Box key={key}>
                  <RadioInput
                    label={input.label}
                    required={input.required}
                    multiSelect={input.multiSelect}
                    options={input.options}
                    value={formData[input.name] as string | string[] || (input.multiSelect ? [] : '')}
                    onChange={(value) => onChange(input.name, value as string)}
                  />
                </Box>
              );

            case 'number': {
              const numValue = formData[input.name];
              return (
                <Box key={key}>
                  <NumberInput
                    label={input.label}
                    required={input.required}
                    hint={input.hint}
                    placeholder={input.placeholder}
                    value={typeof numValue === 'number' ? numValue : ''}
                    min={input.min}
                    max={input.max}
                    onChange={(value) => onChange(input.name, typeof value === 'number' ? value : 0)}
                  />
                </Box>
              );
            }

            case 'slider': {
              const sliderValue = formData[input.name];
              const defaultValue = input.default ?? input.min;
              return (
                <Box key={key}>
                <SliderInput
                  key={key}
                  label={input.label}
                  hint={input.hint}
                  tooltip={input.toolkit}
                  min={input.min}
                  max={input.max}
                  step={1}
                  value={typeof sliderValue === 'number' ? sliderValue : defaultValue}
                  minLabel={input.minLabel}
                  maxLabel={input.maxLabel}
                  onChange={(value) => onChange(input.name, value)}
                />
                </Box>
              );
            }

            default:
              return null;
          }
        })}
      </Box>
    </Box>
  );
}
