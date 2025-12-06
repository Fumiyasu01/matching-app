export type ReportReason = 'spam' | 'inappropriate' | 'fake' | 'harassment' | 'other'

export interface BlockedUser {
  id: string
  user_id: string
  blocked_user_id: string
  created_at: string
}

export interface Report {
  id: string
  reporter_id: string
  reported_user_id: string
  reason: ReportReason
  description?: string
  created_at: string
}
