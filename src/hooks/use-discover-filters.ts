'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface DiscoverFilters {
  lookingFor: ('work' | 'volunteer' | 'both')[]
  skills: string[]
  maxDistance: number | null // null means no distance filter
}

interface DiscoverFiltersStore {
  filters: DiscoverFilters
  setFilters: (filters: Partial<DiscoverFilters>) => void
  resetFilters: () => void
  getActiveFilterCount: () => number
}

const defaultFilters: DiscoverFilters = {
  lookingFor: [],
  skills: [],
  maxDistance: null,
}

export const useDiscoverFilters = create<DiscoverFiltersStore>()(
  persist(
    (set, get) => ({
      filters: defaultFilters,

      setFilters: (newFilters) =>
        set((state) => ({
          filters: { ...state.filters, ...newFilters },
        })),

      resetFilters: () =>
        set({
          filters: defaultFilters,
        }),

      getActiveFilterCount: () => {
        const { filters } = get()
        let count = 0

        if (filters.lookingFor.length > 0) count++
        if (filters.skills.length > 0) count++
        if (filters.maxDistance !== null) count++

        return count
      },
    }),
    {
      name: 'discover-filters',
    }
  )
)
