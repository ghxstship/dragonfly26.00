// Conditional Logic Engine for Forms

export type ConditionOperator =
  | 'equals'
  | 'not_equals'
  | 'contains'
  | 'not_contains'
  | 'greater_than'
  | 'less_than'
  | 'is_empty'
  | 'is_not_empty'
  | 'starts_with'
  | 'ends_with'

export type ActionType =
  | 'show'
  | 'hide'
  | 'require'
  | 'optional'
  | 'enable'
  | 'disable'

export interface Condition {
  id: string
  field: string
  operator: ConditionOperator
  value?: any
  logicalOperator?: 'AND' | 'OR'
}

export interface ConditionalRule {
  id: string
  conditions: Condition[]
  action: ActionType
  targetFields: string[]
  priority?: number
}

export class ConditionalLogicEngine {
  private rules: ConditionalRule[] = []
  private formValues: Record<string, any> = {}

  constructor(rules: ConditionalRule[] = []) {
    this.rules = rules.sort((a, b) => (b.priority || 0) - (a.priority || 0))
  }

  setFormValues(values: Record<string, any>): void {
    this.formValues = values
  }

  evaluateCondition(condition: Condition): boolean {
    const fieldValue = this.formValues[condition.field]

    switch (condition.operator) {
      case 'equals':
        return fieldValue === condition.value

      case 'not_equals':
        return fieldValue !== condition.value

      case 'contains':
        return String(fieldValue || '').includes(String(condition.value))

      case 'not_contains':
        return !String(fieldValue || '').includes(String(condition.value))

      case 'greater_than':
        return Number(fieldValue) > Number(condition.value)

      case 'less_than':
        return Number(fieldValue) < Number(condition.value)

      case 'is_empty':
        return !fieldValue || fieldValue === '' || (Array.isArray(fieldValue) && fieldValue.length === 0)

      case 'is_not_empty':
        return !!fieldValue && fieldValue !== '' && (!Array.isArray(fieldValue) || fieldValue.length > 0)

      case 'starts_with':
        return String(fieldValue || '').startsWith(String(condition.value))

      case 'ends_with':
        return String(fieldValue || '').endsWith(String(condition.value))

      default:
        return false
    }
  }

  evaluateRule(rule: ConditionalRule): boolean {
    if (rule.conditions.length === 0) return false

    // Group conditions by logical operator
    const andConditions: Condition[] = []
    const orConditions: Condition[] = []

    rule.conditions.forEach((condition) => {
      if (condition.logicalOperator === 'OR') {
        orConditions.push(condition)
      } else {
        andConditions.push(condition)
      }
    })

    // Evaluate AND conditions (all must be true)
    const andResult = andConditions.length === 0 || 
      andConditions.every((condition) => this.evaluateCondition(condition))

    // Evaluate OR conditions (at least one must be true)
    const orResult = orConditions.length === 0 || 
      orConditions.some((condition) => this.evaluateCondition(condition))

    return andResult && orResult
  }

  getFieldState(fieldName: string): {
    visible: boolean
    required: boolean
    enabled: boolean
  } {
    const state = {
      visible: true,
      required: false,
      enabled: true
    }

    // Apply rules in priority order
    for (const rule of this.rules) {
      if (!rule.targetFields.includes(fieldName)) continue

      const ruleMatches = this.evaluateRule(rule)

      if (ruleMatches) {
        switch (rule.action) {
          case 'show':
            state.visible = true
            break
          case 'hide':
            state.visible = false
            break
          case 'require':
            state.required = true
            break
          case 'optional':
            state.required = false
            break
          case 'enable':
            state.enabled = true
            break
          case 'disable':
            state.enabled = false
            break
        }
      }
    }

    return state
  }

  getAllFieldStates(): Record<string, {
    visible: boolean
    required: boolean
    enabled: boolean
  }> {
    const allFields = new Set<string>()
    
    // Collect all fields mentioned in rules
    this.rules.forEach((rule) => {
      rule.targetFields.forEach((field) => allFields.add(field))
      rule.conditions.forEach((condition) => allFields.add(condition.field))
    })

    const states: Record<string, any> = {}
    allFields.forEach((field) => {
      states[field] = this.getFieldState(field)
    })

    return states
  }

  addRule(rule: ConditionalRule): void {
    this.rules.push(rule)
    this.rules.sort((a, b) => (b.priority || 0) - (a.priority || 0))
  }

  removeRule(ruleId: string): void {
    this.rules = this.rules.filter((rule) => rule.id !== ruleId)
  }

  updateRule(ruleId: string, updates: Partial<ConditionalRule>): void {
    const index = this.rules.findIndex((rule) => rule.id === ruleId)
    if (index !== -1) {
      this.rules[index] = { ...this.rules[index], ...updates }
      this.rules.sort((a, b) => (b.priority || 0) - (a.priority || 0))
    }
  }
}

// Helper function to create a condition
export function createCondition(
  field: string,
  operator: ConditionOperator,
  value?: any,
  logicalOperator: 'AND' | 'OR' = 'AND'
): Condition {
  return {
    id: crypto.randomUUID(),
    field,
    operator,
    value,
    logicalOperator
  }
}

// Helper function to create a rule
export function createRule(
  conditions: Condition[],
  action: ActionType,
  targetFields: string[],
  priority: number = 0
): ConditionalRule {
  return {
    id: crypto.randomUUID(),
    conditions,
    action,
    targetFields,
    priority
  }
}
