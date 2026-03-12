export type ParentCondition =
  | { name: string; value: string; operator?: never }
  | { name: string; value: string[]; operator: 'includesAny' }

export type Input =
  | {
      type: 'radio'
      name: string
      label: string
      required?: boolean
      hint?: string
      multiSelect?: boolean
      options: { value: string; label: string }[]
      parentCondition?: ParentCondition
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
      parentCondition?: ParentCondition
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
      parentCondition?: ParentCondition
    }

export type Step = {
  id: string
  name: string
  icon: string
  description: string
  helpText?: boolean
  inputs: Input[]
}