'use client'

import { useState, useEffect } from 'react'
import { BaseModal } from '@/components/ui/base-modal'
import { DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { useDiscoverFilters, type DiscoverFilters } from '@/hooks/use-discover-filters'
import { LOOKING_FOR_LABELS, COMMON_SKILLS } from '@/lib/constants'
import { X } from 'lucide-react'

interface FilterModalProps {
  open: boolean
  onClose: () => void
}

export function FilterModal({ open, onClose }: FilterModalProps) {
  // ============================================================================
  // State & Hooks
  // ============================================================================
  const { filters, setFilters, resetFilters } = useDiscoverFilters()
  const [localFilters, setLocalFilters] = useState<DiscoverFilters>(filters)

  // ============================================================================
  // Effects
  // ============================================================================
  // Sync local filters with store when modal opens
  useEffect(() => {
    if (open) {
      setLocalFilters(filters)
    }
  }, [open, filters])

  // ============================================================================
  // Event Handlers
  // ============================================================================
  const handleApply = () => {
    setFilters(localFilters)
    onClose()
  }

  const handleReset = () => {
    const defaultFilters: DiscoverFilters = {
      lookingFor: [],
      skills: [],
      maxDistance: null,
    }
    setLocalFilters(defaultFilters)
    resetFilters()
  }

  const toggleLookingFor = (value: 'work' | 'volunteer' | 'both') => {
    setLocalFilters((prev) => ({
      ...prev,
      lookingFor: prev.lookingFor.includes(value)
        ? prev.lookingFor.filter((v) => v !== value)
        : [...prev.lookingFor, value],
    }))
  }

  const toggleSkill = (skill: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill],
    }))
  }

  const handleDistanceChange = (value: number[]) => {
    setLocalFilters((prev) => ({
      ...prev,
      maxDistance: value[0],
    }))
  }

  const removeSkill = (skill: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }))
  }

  // ============================================================================
  // Render
  // ============================================================================
  return (
    <BaseModal
      open={open}
      onClose={onClose}
      title="フィルター"
      titleClassName="text-2xl font-bold gradient-text"
      className="max-w-lg max-h-[85vh] overflow-y-auto"
    >
      <div className="space-y-6 py-4">
          {/* Looking For Filter */}
          <div>
            <Label className="text-base font-semibold text-gray-900 mb-3 block">
              探しているもの
            </Label>
            <div className="space-y-3">
              {(Object.keys(LOOKING_FOR_LABELS) as Array<keyof typeof LOOKING_FOR_LABELS>).map((key) => (
                <div key={key} className="flex items-center space-x-2">
                  <Checkbox
                    id={`looking-${key}`}
                    checked={localFilters.lookingFor.includes(key)}
                    onCheckedChange={() => toggleLookingFor(key)}
                    className="data-[state=checked]:bg-cyan-500 data-[state=checked]:border-cyan-500"
                  />
                  <label
                    htmlFor={`looking-${key}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {LOOKING_FOR_LABELS[key]}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Skills Filter */}
          <div>
            <Label className="text-base font-semibold text-gray-900 mb-3 block">
              スキル
            </Label>

            {/* Selected Skills */}
            {localFilters.skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {localFilters.skills.map((skill) => (
                  <Badge
                    key={skill}
                    variant="secondary"
                    className="bg-cyan-100 text-cyan-700 hover:bg-cyan-200 pr-1"
                  >
                    {skill}
                    <button
                      onClick={() => removeSkill(skill)}
                      className="ml-1 hover:bg-cyan-300 rounded-full p-0.5 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}

            {/* Available Skills */}
            <div className="grid grid-cols-2 gap-2">
              {COMMON_SKILLS.map((skill) => (
                <div key={skill} className="flex items-center space-x-2">
                  <Checkbox
                    id={`skill-${skill}`}
                    checked={localFilters.skills.includes(skill)}
                    onCheckedChange={() => toggleSkill(skill)}
                    className="data-[state=checked]:bg-cyan-500 data-[state=checked]:border-cyan-500"
                  />
                  <label
                    htmlFor={`skill-${skill}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {skill}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Distance Filter */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <Label className="text-base font-semibold text-gray-900">
                距離
              </Label>
              <span className="text-sm text-gray-600">
                {localFilters.maxDistance !== null
                  ? `${localFilters.maxDistance}km以内`
                  : '制限なし'}
              </span>
            </div>
            <div className="px-2">
              <Slider
                value={[localFilters.maxDistance ?? 100]}
                onValueChange={handleDistanceChange}
                max={100}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>1km</span>
                <span>50km</span>
                <span>100km</span>
              </div>
            </div>
            {localFilters.maxDistance !== null && (
              <button
                onClick={() => setLocalFilters((prev) => ({ ...prev, maxDistance: null }))}
                className="text-sm text-cyan-600 hover:text-cyan-700 mt-2"
              >
                距離制限を解除
              </button>
            )}
          </div>
        </div>

      <DialogFooter className="gap-2 sm:gap-0">
        <Button
          variant="outline"
          onClick={handleReset}
          className="border-gray-300 hover:bg-gray-50"
        >
          リセット
        </Button>
        <Button
          onClick={handleApply}
          className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white"
        >
          適用
        </Button>
      </DialogFooter>
    </BaseModal>
  )
}
