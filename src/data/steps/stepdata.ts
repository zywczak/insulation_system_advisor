// import HomeIcon from "../assets/building_white.svg"
// import PerformanceIcon from "../assets/performance_white.svg"
// import ConstrainsIcon from "../assets/constrains_white.svg"
// import MoistureIcon from "../assets/moisture_white.svg"
// import InstallationIcon from "../assets/installation_white.svg"

// type ParentCondition =
//   | { name: string; value: string; operator?: never }
//   | { name: string; value: string[]; operator: 'includesAny' }

// type Input =
//   | {
//       type: 'radio'
//       name: string
//       label: string
//       required?: boolean
//       hint?: string
//       multiSelect?: boolean
//       options: { value: string; label: string }[]
//       parentCondition?: ParentCondition
//     }
//   | {
//       type: 'number'
//       name: string
//       label: string
//       hint?: string
//       placeholder?: string
//       required?: boolean
//       min?: number
//       max?: number
//       parentCondition?: ParentCondition
//     }
//   | {
//       type: 'slider'
//       name: string
//       label: string
//       hint?: string
//       toolkit?: string
//       default?: number
//       min: number
//       max: number
//       minLabel?: string
//       maxLabel?: string
//       parentCondition?: ParentCondition
//     }

// type Step = {
//   id: string
//   name: string
//   icon: string
//   description: string
//   helpText?: boolean
//   inputs: Input[]
// }

// export const steps: Step[] = [
//   {
//     id: 'building',
//     name: 'Building & Compliance',
//     icon: HomeIcon,
//     description: 'Building type, height, fire requirements, and compliance',
//     inputs: [
//       {
//         type: 'radio',
//         name: 'buildingType',
//         label: 'What type of building is this?',
//         required: true,
//         options: [
//           { value: 'Detached / Semi / Terrace house', label: 'Detached / Semi / Terrace house' },
//           { value: 'Low rise flats (≤3 floors)',       label: 'Low rise flats (≤3 floors)' },
//           { value: 'Mid rise (4–10 floors)',            label: 'Mid rise (4–10 floors)' },
//           { value: 'High rise (>10 floors)',            label: 'High rise (>10 floors)' },
//           { value: 'Commercial / mixed use',            label: 'Commercial / mixed use' },
//         ],
//       },
//       {
//         type: 'number',
//         name: 'buildingHeight',
//         label: 'Building height (meters)',
//         hint: 'Approximate height to the top of the building. Leave blank if unsure.',
//         placeholder: 'e.g. 12',
//         min: 0,
//       },
//       {
//         type: 'radio',
//         name: 'fireRequirements',
//         label: 'Are there fire requirements imposed by any of the following?',
//         hint: 'Select all that apply.',
//         multiSelect: true,
//         options: [
//           { value: 'None',                              label: 'None' },
//           { value: 'Building Control',                  label: 'Building Control' },
//           { value: 'Project spec / architect',          label: 'Project spec / architect' },
//           { value: 'Insurer',                           label: 'Insurer' },
//           { value: 'Housing association / grant spec',  label: 'Housing association / grant spec' },
//           { value: "Don't know",                        label: "Don't know" },
//         ],
//       },
//       {
//         type: 'radio',
//         name: 'fireClass',
//         label: 'What fire classification is required?',
//         required: true,
//         parentCondition: {
//           name: 'fireRequirements',
//           operator: 'includesAny',
//           value: ['Building Control', 'Project spec / architect', 'Insurer', 'Housing association / grant spec'],
//         },
//         options: [
//           { value: 'Non-combustible only', label: 'Non-combustible' },
//           { value: 'A1 only',              label: 'A1 only' },
//           { value: 'A2 acceptable',        label: 'A2 acceptable' },
//           { value: "Don't know",           label: "Don't know" },
//         ],
//       },
//       {
//         type: 'radio',
//         name: 'grantScheme',
//         label: 'Does the project fall under a grant or scheme specification?',
//         hint: 'e.g. ECO, social housing, local authority framework',
//         options: [
//           { value: 'Yes',        label: 'Yes' },
//           { value: 'No',         label: 'No' },
//           { value: "Don't know", label: "Don't know" },
//         ],
//       },
//     ],
//   },
//   {
//     id: 'physical_constraints',
//     name: 'Physical Constraints',
//     icon: ConstrainsIcon,
//     description: 'Thickness limitations and where they apply',
//     inputs: [
//       {
//         type: 'radio',
//         name: 'hasThicknessLimit',
//         label: 'Is there a maximum insulation system thickness?',
//         hint: 'Due to eaves, reveals, boundaries, or other physical constraints.',
//         required: true,
//         options: [
//           { value: 'yes', label: 'Yes' },
//           { value: 'no',  label: 'No' },
//         ],
//       },
//       {
//         type: 'number',
//         name: 'maxThickness',
//         label: 'Maximum available thickness (mm)',
//         placeholder: 'e.g. 100',
//         required: true,
//         min: 0,
//         parentCondition: { name: 'hasThicknessLimit', value: 'yes' },
//       },
//       {
//         type: 'radio',
//         name: 'thicknessConstraintLocations',
//         label: 'Where does the constraint apply?',
//         multiSelect: true,
//         parentCondition: { name: 'hasThicknessLimit', value: 'yes' },
//         options: [
//           { value: 'Eaves / roof line',  label: 'Eaves / roof line' },
//           { value: 'Window reveals',     label: 'Window reveals' },
//           { value: 'Boundary line',      label: 'Boundary line' },
//           { value: 'Balconies',          label: 'Balconies' },
//           { value: 'Services / pipes',   label: 'Services / pipes' },
//         ],
//       },
//     ],
//   },
//   {
//     id: 'wall_moisture',
//     name: 'Wall & Moisture',
//     icon: MoistureIcon,
//     description: 'Wall construction, age, moisture symptoms, and heritage',
//     inputs: [
//       {
//         type: 'radio',
//         name: 'wallType',
//         label: 'What type of wall construction?',
//         required: true,
//         options: [
//           { value: 'Solid Brick Walls',       label: 'Solid Brick Walls' },
//           { value: 'Solid Stone Walls',        label: 'Solid Stone Walls' },
//           { value: 'Concrete Blocks',          label: 'Concrete Blocks' },
//           { value: 'Cavity Walls - Unfilled',  label: 'Cavity Walls - Unfilled' },
//           { value: 'Timber Frame',             label: 'Timber Frame' },
//         ],
//       },
//       {
//         type: 'radio',
//         name: 'buildingAge',
//         label: 'When was the building constructed?',
//         options: [
//           { value: 'Pre 1920',   label: 'Pre 1920' },
//           { value: '1920–1970',  label: '1920–1970' },
//           { value: '1970–2000',  label: '1970–2000' },
//           { value: '2000+',      label: '2000+' },
//         ],
//       },
//       {
//         type: 'radio',
//         name: 'moistureSymptoms',
//         label: 'Are any of the following moisture issues present?',
//         multiSelect: true,
//         options: [
//           { value: 'Damp patches internal',          label: 'Damp patches internal' },
//           { value: 'Mould growth',                   label: 'Mould growth' },
//           { value: 'Condensation heavy',             label: 'Condensation heavy' },
//           { value: 'Salt staining / blown plaster',  label: 'Salt staining / blown plaster' },
//           { value: 'None',                           label: 'None' },
//         ],
//       },
//       {
//         type: 'radio',
//         name: 'heritageFeatures',
//         label: 'Does the building have any of the following?',
//         multiSelect: true,
//         options: [
//           { value: 'None',                           label: 'None' },
//           { value: 'Lime mortar',                    label: 'Lime mortar' },
//           { value: 'Lime render',                    label: 'Lime render' },
//           { value: 'Heritage listing / conservation',label: 'Heritage listing / conservation' },
//           { value: "Don't know",                     label: "Don't know" },
//         ],
//       },
//     ],
//   },
//   {
//     id: 'priorities',
//     name: 'Performance Priorities',
//     icon: PerformanceIcon,
//     description: 'Rate what matters most for your project',
//     helpText: true,
//     inputs: [
//       {
//         type: 'slider',
//         name: 'priorityCost',
//         label: 'Lowest investment cost',
//         hint: 'How important is minimising upfront cost?',
//         toolkit: 'Ideal for the fastest return on investment. Systems like EPS (Polystyrene) dominate this category.',
//         min: 0,
//         max: 5,
//         minLabel: 'Not important',
//         maxLabel: 'Critical',
//       },
//       {
//         type: 'slider',
//         name: 'priorityThicknessEfficiency',
//         label: 'Best performance at minimal thickness',
//         hint: 'Need to maximise insulation in limited space?',
//         toolkit: "Crucial for narrow passageways or when you want to minimize the change to the building's footprint. Suggests premium systems like Kingspan K5 or PIR",
//         min: 0,
//         max: 5,
//         minLabel: 'Not important',
//         maxLabel: 'Critical',
//       },
//       {
//         type: 'slider',
//         name: 'priorityBreathability',
//         label: 'Breathability & moisture management',
//         hint: 'Is vapour permeability important for this wall?',
//         toolkit: "Vital for older solid-wall properties. Promotes vapour-permeable systems like Mineral Wool or Woodfibre to prevent damp.",
//         min: 0,
//         max: 5,
//         minLabel: 'Not important',
//         maxLabel: 'Critical',
//       },
//       {
//         type: 'slider',
//         name: 'priorityAcoustics',
//         label: 'Noise reduction',
//         hint: 'Is acoustic performance a concern?',
//         toolkit: "Best if your property is near a busy road or airport. High-density materials like Mineral Wool offer the best acoustic insulation.",
//         min: 0,
//         max: 5,
//         minLabel: 'Not important',
//         maxLabel: 'Critical',
//       },
//       {
//         type: 'slider',
//         name: 'prioritySummerComfort',
//         label: 'Summer comfort / overheating prevention',
//         hint: 'Is overheating a risk or concern?',
//         toolkit: "Protects against walls heating up in summer. Woodfibre has the highest thermal mass to keep interiors cool.",
//         min: 0,
//         max: 5,
//         minLabel: 'Not important',
//         maxLabel: 'Critical',
//       },
//       {
//         type: 'slider',
//         name: 'priorityNaturalMaterials',
//         label: 'Natural / low embodied carbon materials',
//         hint: 'How important are environmental credentials?',
//         toolkit: "For eco-conscious projects. Focuses on renewable materials like Woodfibre which can even have a negative carbon footprint.",
//         min: 0,
//         max: 5,
//         minLabel: 'Not important',
//         maxLabel: 'Critical',
//       },
//     ],
//   },
//   {
//     id: 'installation_delivery',
//     name: 'Installation & Delivery',
//     icon: InstallationIcon,
//     description: 'Project type, speed, and workmanship expectations',
//     inputs: [
//       {
//         type: 'radio',
//         name: 'projectType',
//         label: 'What type of project / installer?',
//         required: true,
//         options: [
//           { value: 'Developer / main contractor',    label: 'Developer / main contractor' },
//           { value: 'Local installer',                label: 'Local installer' },
//           { value: 'Specialist facade contractor',   label: 'Specialist facade contractor' },
//         ],
//       },
//       {
//         type: 'slider',
//         name: 'prioritySpeed',
//         label: 'Speed of installation priority',
//         hint: 'How important is fast installation?',
//         default: 3,
//         min: 0,
//         max: 5,
//         minLabel: 'Not important',
//         maxLabel: 'Critical',
//       },
//       {
//         type: 'radio',
//         name: 'workmanshipQuality',
//         label: 'Expected workmanship quality level',
//         options: [
//           { value: 'Standard market level', label: 'Standard market level' },
//           { value: 'Above average',          label: 'Above average' },
//           { value: 'Specialist high-end',    label: 'Specialist high-end' },
//         ],
//       },
//     ],
//   },
// ]


import { buildingStep } from "./buildingStep"
import { physicalConstraintsStep } from "./physicalConstraintsStep"
import { wallMoistureStep } from "./wallMoistureStep"
import { performancePrioritiesStep } from "./performancePrioritiesStep"
import { installationDeliveryStep } from "./installationDeliveryStep"

export const steps = [
  buildingStep,
  physicalConstraintsStep,
  wallMoistureStep,
  performancePrioritiesStep,
  installationDeliveryStep,
]