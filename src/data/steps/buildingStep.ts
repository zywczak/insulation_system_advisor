import HomeIcon from "../../assets/building_white.svg"
import { Step } from "./types"

export const buildingStep: Step = {
  id: 'building',
  name: 'Building & Compliance',
  icon: HomeIcon,
  description: 'Building type, height, fire requirements, and compliance',
  inputs: [
    {
      type: 'radio',
      name: 'building_type',
      label: 'What type of building is this?',
      required: true,
      options: [
        { value: 'detached', label: 'Detached / Semi / Terrace house' },
        { value: 'low_rise', label: 'Low rise flats (≤3 floors)' },
        { value: 'mid_rise', label: 'Mid rise (4–10 floors)' },
        { value: 'high_rise', label: 'High rise (>10 floors)' },
        { value: 'commercial', label: 'Commercial / mixed use' },
      ],
    },
    {
      type: 'number',
      name: 'building_height',
      label: 'Building height (meters)',
      hint: 'Approximate height to the top of the building. Leave blank if unsure.',
      placeholder: 'e.g. 12',
      min: 0,
    },
    {
      type: 'radio',
      name: 'fire_requirement',
      label: 'Are there fire requirements imposed by any of the following?',
      hint: 'Select all that apply.',
      multiSelect: true,
      options: [
        { value: 'none', label: 'None' },
        { value: 'building_control', label: 'Building Control' },
        { value: 'project_spec', label: 'Project spec / architect' },
        { value: 'insurer', label: 'Insurer' },
        { value: 'housing_association', label: 'Housing association / grant spec' },
        { value: 'dont_know', label: "Don't know" },
      ],
    },
    {
      type: 'radio',
      name: 'fire_classification',
      label: 'What fire classification is required?',
      parentCondition: {
        name: 'fire_requirement',
        operator: 'includesAny',
        value: ['building_control', 'project_spec', 'insurer', 'housing_association'],
      },
      required: true,
      options: [
        { value: 'Non-combustible', label: 'Non-combustible' },
        { value: 'a1_only', label: 'A1 only' },
        { value: 'a2_acceptable', label: 'A2 acceptable' },
        { value: 'dont_know', label: "Don't know" },
      ],
    },
    {
      type: 'radio',
      name: 'grant',
      label: 'Does the project fall under a grant or scheme specification?',
      hint: 'e.g. ECO, social housing, local authority framework',
      options: [
        { value: 'yes', label: 'Yes' },
        { value: 'no', label: 'No' },
        { value: 'dont_know', label: "Don't know" },
      ],
    },
  ],
}