// Looking for labels
export const LOOKING_FOR_LABELS = {
  work: '仕事を探している',
  volunteer: 'ボランティアを探している',
  both: '仕事・ボランティア両方',
} as const

export type LookingFor = keyof typeof LOOKING_FOR_LABELS

// Time slot labels
export const TIME_SLOT_LABELS = {
  morning: '午前',
  afternoon: '午後',
  evening: '夜',
  all_day: '終日',
} as const

export type TimeSlotKey = keyof typeof TIME_SLOT_LABELS

// Location type labels
export const LOCATION_TYPE_LABELS = {
  remote: 'リモート',
  onsite: '現地',
  both: 'どちらでも',
} as const

export type LocationTypeKey = keyof typeof LOCATION_TYPE_LABELS

// Availability type labels
export const AVAILABILITY_TYPE_LABELS = {
  work: 'お仕事',
  volunteer: 'ボランティア',
  both: 'どちらでも',
} as const

export type AvailabilityTypeKey = keyof typeof AVAILABILITY_TYPE_LABELS

// Availability type color classes
export const AVAILABILITY_TYPE_COLORS = {
  work: 'bg-blue-100 text-blue-700',
  volunteer: 'bg-green-100 text-green-700',
  both: 'bg-purple-100 text-purple-700',
} as const

// Common skills for filtering
export const COMMON_SKILLS = [
  'React',
  'TypeScript',
  'Python',
  'デザイン',
  'マーケティング',
  'ライティング',
  'PM',
  'データ分析',
  'AI/ML',
  '営業',
] as const

// Report reason labels
export const REPORT_REASON_LABELS = {
  spam: 'スパム・宣伝',
  inappropriate: '不適切なコンテンツ',
  fake: '偽アカウント',
  harassment: '嫌がらせ',
  other: 'その他',
} as const

export type ReportReasonKey = keyof typeof REPORT_REASON_LABELS
