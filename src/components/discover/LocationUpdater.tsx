'use client'

import { useEffect, useState } from 'react'
import { useGeolocation, useUpdateLocation } from '@/hooks/use-geolocation'
import { MapPin, MapPinOff } from 'lucide-react'
import { toast } from 'sonner'

interface LocationUpdaterProps {
  onLocationUpdate?: (coords: { latitude: number; longitude: number }) => void
}

export function LocationUpdater({ onLocationUpdate }: LocationUpdaterProps) {
  const { latitude, longitude, error, loading, requestLocation } = useGeolocation()
  const updateLocation = useUpdateLocation()
  const [hasRequested, setHasRequested] = useState(false)
  const [permissionDenied, setPermissionDenied] = useState(false)

  // Request location on mount
  useEffect(() => {
    if (hasRequested) return

    const updateUserLocation = async () => {
      try {
        const coords = await requestLocation()
        await updateLocation.mutateAsync(coords)
        onLocationUpdate?.(coords)
      } catch (err) {
        if (err instanceof Error && err.message.includes('許可されていません')) {
          setPermissionDenied(true)
        }
      }
    }

    setHasRequested(true)
    updateUserLocation()
  }, [hasRequested, requestLocation, updateLocation, onLocationUpdate])

  // Update parent when location changes
  useEffect(() => {
    if (latitude && longitude) {
      onLocationUpdate?.({ latitude, longitude })
    }
  }, [latitude, longitude, onLocationUpdate])

  // Show permission denied state
  if (permissionDenied) {
    return (
      <button
        onClick={async () => {
          try {
            const coords = await requestLocation()
            await updateLocation.mutateAsync(coords)
            onLocationUpdate?.(coords)
            setPermissionDenied(false)
          } catch (err) {
            toast.error('位置情報を許可してください')
          }
        }}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 text-gray-500 text-xs hover:bg-gray-200 transition-colors"
      >
        <MapPinOff className="h-3.5 w-3.5" />
        <span>位置情報OFF</span>
      </button>
    )
  }

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-50 text-cyan-600 text-xs">
        <MapPin className="h-3.5 w-3.5 animate-pulse" />
        <span>取得中...</span>
      </div>
    )
  }

  // Location available
  if (latitude && longitude) {
    return (
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-50 text-cyan-600 text-xs">
        <MapPin className="h-3.5 w-3.5" />
        <span>位置情報ON</span>
      </div>
    )
  }

  return null
}
