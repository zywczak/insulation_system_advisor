import MoistureIcon from "../../assets/moisture_white.svg"
import { Step } from "./types"

export const wallMoistureStep: Step = {
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
        { value: 'none', label: 'None' },
        { value: 'lime_mortar', label: 'Lime mortar' },
        { value: 'lime_render', label: 'Lime render' },
        { value: 'heritage_listing_conservation', label: 'Heritage listing / conservation' },
        { value: 'dont_know', label: "Don't know" },
      ],
    },
  ],
}