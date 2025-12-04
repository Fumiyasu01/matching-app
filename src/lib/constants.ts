export const LOOKING_FOR_LABELS = {
  work: '仕事を探している',
  volunteer: 'ボランティアを探している',
  both: '仕事・ボランティア両方',
} as const

export type LookingFor = keyof typeof LOOKING_FOR_LABELS
