'use client'

import { useState, useCallback } from 'react'

interface UseTagListReturn {
  tags: string[]
  inputValue: string
  setInputValue: (value: string) => void
  addTag: () => void
  removeTag: (tag: string) => void
  setTags: (tags: string[]) => void
}

export function useTagList(initialTags: string[] = []): UseTagListReturn {
  const [tags, setTags] = useState<string[]>(initialTags)
  const [inputValue, setInputValue] = useState('')

  const addTag = useCallback(() => {
    const trimmed = inputValue.trim()
    if (trimmed && !tags.includes(trimmed)) {
      setTags(prev => [...prev, trimmed])
      setInputValue('')
    }
  }, [inputValue, tags])

  const removeTag = useCallback((tag: string) => {
    setTags(prev => prev.filter(t => t !== tag))
  }, [])

  return {
    tags,
    inputValue,
    setInputValue,
    addTag,
    removeTag,
    setTags,
  }
}
