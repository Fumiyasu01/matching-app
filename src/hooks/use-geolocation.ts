'use client'

import { useState, useEffect, useCallback } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { ensureAuthenticated } from '@/lib/auth'
import { queryKeys } from '@/lib/query-keys'
import { invalidateAfterProfileUpdate } from '@/lib/query-invalidation'

interface GeolocationState {
  latitude: number | null
  longitude: number | null
  error: string | null
  loading: boolean
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    error: null,
    loading: false,
  })

  const getCurrentPosition = useCallback((): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported'))
        return
      }

      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000, // Cache for 1 minute
      })
    })
  }, [])

  const requestLocation = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }))

    try {
      const position = await getCurrentPosition()
      setState({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        error: null,
        loading: false,
      })
      return {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      }
    } catch (err) {
      const error = err instanceof GeolocationPositionError
        ? getGeolocationErrorMessage(err)
        : '位置情報の取得に失敗しました'

      setState(prev => ({ ...prev, error, loading: false }))
      throw new Error(error)
    }
  }, [getCurrentPosition])

  return {
    ...state,
    requestLocation,
  }
}

function getGeolocationErrorMessage(error: GeolocationPositionError): string {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      return '位置情報の使用が許可されていません'
    case error.POSITION_UNAVAILABLE:
      return '位置情報を取得できませんでした'
    case error.TIMEOUT:
      return '位置情報の取得がタイムアウトしました'
    default:
      return '位置情報の取得に失敗しました'
  }
}

// Hook to update user's location in the database
export function useUpdateLocation() {
  const supabase = createClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (coords: { latitude: number; longitude: number }) => {
      const user = await ensureAuthenticated()

      const { error } = await supabase
        .from('profiles')
        .update({
          latitude: coords.latitude,
          longitude: coords.longitude,
          location_updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)

      if (error) throw new Error('位置情報の更新に失敗しました')
    },
    onSuccess: () => {
      invalidateAfterProfileUpdate(queryClient)
    },
  })
}

// Calculate distance between two points (client-side)
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const earthRadius = 6371 // km
  const dLat = toRadians(lat2 - lat1)
  const dLng = toRadians(lng2 - lng1)

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
    Math.cos(toRadians(lat2)) *
    Math.sin(dLng / 2) *
    Math.sin(dLng / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return earthRadius * c
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180)
}

// Format distance for display
export function formatDistance(km: number): string {
  if (km < 1) {
    return `${Math.round(km * 1000)}m`
  }
  if (km < 10) {
    return `${km.toFixed(1)}km`
  }
  return `${Math.round(km)}km`
}
