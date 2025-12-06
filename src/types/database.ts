export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          display_name: string
          avatar_url: string | null
          bio: string | null
          skills: string[]
          interests: string[]
          location: string | null
          looking_for: 'work' | 'volunteer' | 'both'
          latitude: number | null
          longitude: number | null
          location_updated_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          display_name: string
          avatar_url?: string | null
          bio?: string | null
          skills?: string[]
          interests?: string[]
          location?: string | null
          looking_for?: 'work' | 'volunteer' | 'both'
          latitude?: number | null
          longitude?: number | null
          location_updated_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          display_name?: string
          avatar_url?: string | null
          bio?: string | null
          skills?: string[]
          interests?: string[]
          location?: string | null
          looking_for?: 'work' | 'volunteer' | 'both'
          latitude?: number | null
          longitude?: number | null
          location_updated_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      swipes: {
        Row: {
          id: string
          swiper_id: string
          swiped_id: string
          action: 'like' | 'pass'
          created_at: string
        }
        Insert: {
          id?: string
          swiper_id: string
          swiped_id: string
          action: 'like' | 'pass'
          created_at?: string
        }
        Update: {
          id?: string
          swiper_id?: string
          swiped_id?: string
          action?: 'like' | 'pass'
          created_at?: string
        }
      }
      matches: {
        Row: {
          id: string
          user1_id: string
          user2_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user1_id: string
          user2_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user1_id?: string
          user2_id?: string
          created_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          match_id: string
          sender_id: string
          content: string
          read_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          match_id: string
          sender_id: string
          content: string
          read_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          match_id?: string
          sender_id?: string
          content?: string
          read_at?: string | null
          created_at?: string
        }
      }
    }
  }
}

export type Profile = Database['public']['Tables']['profiles']['Row']
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

export type Swipe = Database['public']['Tables']['swipes']['Row']
export type SwipeInsert = Database['public']['Tables']['swipes']['Insert']

export type Match = Database['public']['Tables']['matches']['Row']

export type Message = Database['public']['Tables']['messages']['Row']
export type MessageInsert = Database['public']['Tables']['messages']['Insert']

// Availability Slots - 募集枠
export type TimeSlot = 'morning' | 'afternoon' | 'evening' | 'all_day'
export type AvailabilityType = 'work' | 'volunteer' | 'both'
export type LocationType = 'remote' | 'onsite' | 'both'
export type AvailabilityStatus = 'open' | 'matched' | 'completed'

export interface AvailabilitySlot {
  id: string
  user_id: string
  date: string // "2024-12-07"
  time_slot: TimeSlot
  time_detail?: string // "10:00-15:00"
  type: AvailabilityType
  title: string
  description?: string
  location: LocationType
  area?: string // "東京都渋谷区"
  status: AvailabilityStatus
  created_at: string
}

// Extended Profile with detailed information
export interface ProfileWithDetails extends Profile {
  headline?: string // 一言キャッチコピー
  detailed_bio?: string // 詳細自己紹介
  availability_hours?: string // "週10時間程度"
  preferred_style?: string // "単発" | "継続" | "プロジェクト型"
  portfolio_url?: string
  availability_slots?: AvailabilitySlot[]
}
