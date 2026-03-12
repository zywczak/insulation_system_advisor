import { Box } from '@mui/material';
import IconTextBlock from '../icontextbloick';
import { NumberInput } from './Numberinput';
import { RadioInput } from './Radioinput';
import { SliderInput } from './Sliderinput';
import Description from './Description';
import { steps } from '@/data/steps/stepdata';

// ─── Types ───────────────────────────────────────────────────────────────────

export type FormValue = string | number | string[] | boolean | null;

interface DynamicStepRendererProps {
  readonly stepIndex: number;
  readonly formData: Record<string, FormValue>;
  readonly onChange: (name: string, value: FormValue) => void;
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

      <Box>
        {step.inputs.map((input, idx) => {
          const key = `${input.name}-${idx}`;

          // Check parent condition
          if (input.parentCondition) {
            const parentValue = formData[input.parentCondition.name];
            let matches = false;

            if (input.parentCondition.operator === 'includesAny') {
              // Check if parentValue includes any of the values in the array
              const conditionValues = input.parentCondition.value as string[];
              if (Array.isArray(parentValue)) {
                matches = parentValue.some(val => conditionValues.includes(String(val)));
              } else {
                matches = conditionValues.includes(String(parentValue));
              }
            } else {
              // Simple equality check
              const conditionValue = input.parentCondition.value as string;
              matches =
                parentValue === conditionValue ||
                (conditionValue === 'yes' && parentValue === true) ||
                (conditionValue === 'no' && parentValue === false);
            }

            if (!matches) return null;
          }

          switch (input.type) {
            case 'radio': {
              const raw = formData[input.name];
              const radioValue = input.multiSelect
                ? Array.isArray(raw) ? raw : []
                : typeof raw === 'string' ? raw : '';
              return (
                <Box key={key}>
                  <RadioInput
                    label={input.label}
                    required={input.required}
                    multiSelect={input.multiSelect}
                    options={input.options}
                    value={radioValue}
                    onChange={(value) => onChange(input.name, value)}
                  />
                </Box>
              );
            }

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