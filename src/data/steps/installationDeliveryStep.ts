import InstallationIcon from "../../assets/installation_white.svg"
import { Step } from "./types"

export const installationDeliveryStep: Step = {
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
}