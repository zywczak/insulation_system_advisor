import HomeIcon from "../assets/building_white.svg"
import PerformanceIcon from "../assets/performance_white.svg"
import ConstrainsIcon from "../assets/constrains_white.svg"
import MoistureIcon from "../assets/moisture_white.svg"
import InstallationIcon from "../assets/installation_white.svg"

type Input =
  | {
      type: 'radio'
      name: string
      label: string
      required?: boolean
      hint?: string
      multiSelect?: boolean
      options: { value: string; label: string }[]
      parentCondition?: { name: string; value: string }
    }
  | {
      type: 'number'
      name: string
      label: string
      hint?: string
      placeholder?: string
      required?: boolean
      min?: number
      max?: number
      parentCondition?: { name: string; value: string }
    }
  | {
      type: 'slider'
      name: string
      label: string
      hint?: string
      toolkit?: string
      default?: number
      min: number
      max: number
      minLabel?: string
      maxLabel?: string
      parentCondition?: { name: string; value: string }
    }

type Step = {
  id: string
  name: string
  icon: string
  description: string
  helpText?: boolean
  inputs: Input[]
}

export const steps: Step[] = [
  {
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
          { value: 'dont_know', label: 'Don\'t know' },
        ],
      },
      {
        type: 'radio',
        name: 'fire_classification',
        label: 'What fire classification is required?',
        required: true,
        options: [
          { value: 'Non-combustible', label: 'Non-combustible' },
          { value: 'a1_only', label: 'A1 only' },
          { value: 'a2_acceptable', label: 'A2 acceptable' },
          { value: 'dont_know', label: 'Don\'t know' },
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
          { value: 'dont_know', label: 'Don\'t know' },
        ],
      },
      
    ],
  },
  {
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
  },
  {
    id: 'wall_moisture',
    name: 'Wall & Moisture',
    icon: MoistureIcon,
    description: 'Wall construction, age, moisture symptoms, and heritage',
    inputs: [
      {
        type: 'radio',
        name: 'wall_construction',
        label: 'What type of wall construction?',
        required: true,
        options: [
          { value: 'solid_brick_walls', label: 'Solid Brick Walls' },
          { value: 'solid_stone_walls', label: 'Solid Stone Walls' },
          { value: 'concrete_blocks', label: 'Concrete Blocks' },
          { value: 'cavity_walls_unfilled', label: 'Cavity Walls - Unfilled' },
          { value: 'timber_frame', label: 'Timber Frame' },
        ],
      },
      {
        type: 'radio',
        name: 'construction_year',
        label: 'When was the building constructed?',
        options: [
          { value: 'pre_1920', label: 'Pre 1920' },
          { value: '1920_1970', label: '1920-1970' },
          { value: '1970_2000', label: '1970-2000' },
          { value: 'post_2000', label: '2000+' },
        ],
      },
      {
        type: 'radio',
        name: 'moisture_issues',
        label: 'Are any of the following moisture issues present?',
        multiSelect: true,
        options: [
          { value: 'damp_patches_internal', label: 'Damp patches internal' },
          { value: 'mould_growth', label: 'Mould growth' },
          { value: 'condensation_heavy', label: 'Condensation heavy' },
          { value: 'salt_staining_blown_plaster', label: 'Salt staining / blown plaster' },
          { value: 'none', label: 'None' },
        ],
      },
      {
        type: 'radio',
        name: 'building_features',
        label: 'Does the building have any of the following?',
        multiSelect: true,
        options: [
          { label: 'None', value: 'none' },
          { label: 'Lime mortar', value: 'lime_mortar' },
          { label: 'Lime render', value: 'lime_render' },
          { label: 'Heritage listing / conservation', value: 'heritage_listing_conservation' },
          { label: "Don't know", value: 'dont_know' },
        ],
      },
    ],
  },
  {
    id: 'priorities',
    name: 'Performance Priorities',
    icon: PerformanceIcon,
    description: 'Rate what matters most for your project',
    helpText: true,
    inputs: [
      {
        type: 'slider',
        name: 'low_cost_priority',
        label: 'Lowest investment cost',
        hint: 'How important is minimising upfront cost?',
        toolkit: 'Ideal for the fastest return on investment. Systems like EPS (Polystyrene) dominate this category.',
        min: 0,
        max: 5,
        minLabel: 'Not important',
        maxLabel: 'Critical',
      },
      {
        type: 'slider',
        name: 'minimal_thickness_priority',
        label: 'Best performance at minimal thickness',
        hint: 'Need to maximise insulation in limited space?',
        toolkit: "Crucial for narrow passageways or when you want to minimize the change to the building's footprint. Suggests premium systems like Kingspan K5 or PIR",
        min: 0,
        max: 5,
        minLabel: 'Not important',
        maxLabel: 'Critical',
      },
      {
        type: 'slider',
        name: 'breathability_priority',
        label: 'Breathability & moisture management',
        hint: 'Is vapour permeability important for this wall?',
        toolkit: "Vital for older solid-wall properties. Promotes vapour-permeable systems like Mineral Wool or Woodfibre to prevent damp.",
        min: 0,
        max: 5,
        minLabel: 'Not important',
        maxLabel: 'Critical',
      },
      {
        type: 'slider',
        name: 'noise_reduction_priority',
        label: 'Noise reduction',
        hint: 'Is acoustic performance a concern?',
        toolkit: "Best if your property is near a busy road or airport. High-density materials like Mineral Wool offer the best acoustic insulation.",
        min: 0,
        max: 5,
        minLabel: 'Not important',
        maxLabel: 'Critical',
      },
      {
        type: 'slider',
        name: 'summer_comfort_priority',
        label: 'Summer comfort / overheating prevention',
        hint: 'Is overheating a risk or concern?',
        toolkit: "Protects against walls heating up in summer. Woodfibre has the highest thermal mass to keep interiors cool.",
        min: 0,
        max: 5,
        minLabel: 'Not important',
        maxLabel: 'Critical',
      },
      {
        type: 'slider',
        name: 'low_embodied_carbon_priority',
        label: 'Natural / low embodied carbon materials',
        hint: 'How important are environmental credentials?',
        toolkit: "For eco-conscious projects. Focuses on renewable materials like Woodfibre which can even have a negative carbon footprint.",
        min: 0,
        max: 5,
        minLabel: 'Not important',
        maxLabel: 'Critical',
      },
    ],
  },
   {
    id: 'installation_delivery',
    name: 'Installation & Delivery',
    icon: InstallationIcon,
    description: 'Project type, speed, and workmanship expectations',
    inputs: [
      {
        type: 'radio',
        name: 'project_type',
        label: 'What type of project / installer?',
        required: true,
        options: [
          { value: 'developer_main_contractor', label: 'Developer / main contractor' },
          { value: 'local_installer', label: 'Local installer' },
          { value: 'specialist_facade_contractor', label: 'Specialist facade contractor' },
        ],
      },
      {
        type: 'slider',
        name: 'speed_of_installation_priority',
        label: 'Speed of installation priority',
        hint: 'How important is fast installation?',
        default: 3,
        min: 0,
        max: 5,
        minLabel: 'Not important',
        maxLabel: 'Critical',
      },
      {
        type: 'radio',
        name: 'workmanship_quality',
        label: 'Expected workmanship quality level',
        options: [
          { value: 'standard_market_level', label: 'Standard market level' },
          { value: 'above_average', label: 'Above average' },
          { value: 'specialist_high_end', label: 'Specialist high-end' },
        ],
      },
    ],
  },
]