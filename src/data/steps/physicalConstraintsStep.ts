import ConstrainsIcon from "../../assets/constrains_white.svg"
import { Step } from "./types"

export const physicalConstraintsStep: Step = {
  id: 'physical_constraints',
  name: 'Physical Constraints',
  icon: ConstrainsIcon,
  description: 'Thickness limitations and where they apply',
  inputs: [
    {
      type: 'radio',
      name: 'maximum_insulation',
      label: 'Is there a maximum insulation system thickness?',
      hint: 'Due to eaves, reveals, boundaries, or other physical constraints.',
      required: true,
      options: [
        { value: 'yes', label: 'Yes' },
        { value: 'no', label: 'No' },
      ],
    },
    {
      type: 'number',
      name: 'maximum_thickness',
      label: 'Maximum available thickness (mm)',
      placeholder: 'e.g. 100',
      required: true,
      min: 0,
      parentCondition: { name: 'maximum_insulation', value: 'yes' },
    },
    {
      type: 'radio',
      name: 'constraint_apply',
      label: 'Where does the constraint apply?',
      multiSelect: true,
      parentCondition: { name: 'maximum_insulation', value: 'yes' },
      options: [
        { value: 'eaves_roof_line', label: 'Eaves / roof line' },
        { value: 'window_reveals', label: 'Window reveals' },
        { value: 'boundary_line', label: 'Boundary line' },
        { value: 'balconies', label: 'Balconies' },
        { value: 'services_pipes', label: 'Services / pipes' },
      ],
    },
  ],
}